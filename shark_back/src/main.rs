use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, get, post},
    Json, Router,
};
use chrono::Utc;
use entity::{shark_comment, shark_post};
use migration::Migrator;
use migration::MigratorTrait;
use sea_orm::{
    ActiveModelTrait, ActiveValue, ColumnTrait, Database, DatabaseConnection, EntityTrait,
    PaginatorTrait, QueryFilter,
};
use serde_json::json;
use sqlx::sqlite::SqliteConnectOptions;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
struct AppState {
    db: DatabaseConnection,
}

/// Get posts from database
async fn get_posts(
    State(state): State<AppState>,
    param: Option<Path<(i64, u64)>>,
) -> Json<Vec<shark_post::Model>> {
    let (id, size) = match param {
        Some(Path(params)) => params,
        None => (0, 10),
    };
    let mut posts = shark_post::Entity::find()
        .filter(shark_post::Column::Id.gt(id))
        .paginate(&state.db, size);

    let posts = posts
        .fetch_and_next()
        .await
        .expect("Pagination error while fetching posts");

    Json(posts.unwrap_or(vec![]))
}

async fn get_post(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    let post = shark_post::Entity::find_by_id(id)
        .one(&state.db)
        .await
        .unwrap();

    match post {
        None => (StatusCode::NOT_FOUND, Json(json!({"code": 404}))),
        Some(post) => (StatusCode::OK, Json(serde_json::to_value(post).unwrap())),
    }
}

async fn new_post(
    State(state): State<AppState>,
    Json(post): Json<shark_post::NewInsert>,
) -> impl IntoResponse {
    let post = shark_post::ActiveModel {
        user_id: ActiveValue::Set(post.user_id),
        title: ActiveValue::Set(post.title),
        location_latitude: ActiveValue::Set(post.location_latitude),
        location_longitude: ActiveValue::Set(post.location_longitude),
        description: ActiveValue::Set(post.description),
        created_at: ActiveValue::Set(Utc::now().to_string()),
        updated_at: ActiveValue::Set(Some(Utc::now().to_string())),
        ..Default::default()
    };
    let post = post.insert(&state.db).await.unwrap();
    (StatusCode::CREATED, Json(post))
}

async fn get_comments(Path(id): Path<i64>) -> Json<Vec<shark_comment::Model>> {
    let comments: Vec<shark_comment::Model> = vec![shark_comment::Model {
        post_id: id,
        ..Default::default()
    }];
    Json(comments)
}

async fn get_comment(Path(id): Path<i64>, Path(cid): Path<i64>) -> Json<shark_comment::Model> {
    let comment: shark_comment::Model = shark_comment::Model {
        id: cid,
        post_id: id,
        ..Default::default()
    };
    Json(comment)
}

async fn delete_comment(Path(_cid): Path<u64>) -> Json<bool> {
    // let deleted = shark_comment::Entity::delete_by_id(cid).exec(db).await;
    // return Json(deleted.is_ok());
    Json(true)
}

#[tokio::main]
async fn main() {
    let db_path = "SeaORM.db";

    // Create SQLite database if it does not exist
    let options = SqliteConnectOptions::new();
    let options = options
        .filename(format!("./{}", db_path))
        .create_if_missing(true);

    let pool = sqlx::sqlite::SqlitePoolOptions::new()
        .connect_with(options)
        .await
        .expect("Could not connect to sqlite db");

    // close connection
    drop(pool);

    // Connect to the database using sea_orm
    let db = Database::connect(format!("sqlite://{}", db_path))
        .await
        .expect("Could not connect to database");

    Migrator::up(&db, None)
        .await
        .expect("Could not migrate database");

    let state = AppState { db };

    let app = Router::new()
        .route("/posts", get(get_posts))
        .route("/posts/:id", get(get_posts))
        .route("/posts/:id/:size", get(get_posts))
        .route("/new_post", post(new_post))
        .route("/post/:id", get(get_post))
        .route("/post/:id/comments", get(get_comments))
        .route("/post/:id/comment/:cid", get(get_comment))
        // .route("/post/:id/comment/:cid", post(post_comment))
        .route("/post/:id/comment/:cid", delete(delete_comment))
        // .route("/post/:id/comment/:cid", put(put_comment))
        // .route("/post/:id/comment/:cid", patch(patch_comment))
        // CORS
        .layer(CorsLayer::permissive())
        // DATABASE
        .with_state(state);

    // Make the service available at http://localhost:8080
    const HOST: &str = "0.0.0.0";
    const PORT: u16 = 8080;
    println!("Listening on http://{HOST}:{PORT}");
    axum::Server::bind(&format!("{}:{}", HOST, PORT).parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
