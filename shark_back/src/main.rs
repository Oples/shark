use axum::{
    extract::Path,
    routing::{delete, get, patch, post, put},
    Json, Router,
};
mod models;
use models::{shark_comment, shark_post};
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, PartialEq)]
#[ts(export)]
pub struct SharkPost {
    id: u64,
    user_id: u64,
    img_url: String,
    title: String,
    location: String,
    description: String,
    created_at: String,
    updated_at: String,
}

async fn get_posts(param: Option<Path<(u64, u64)>>) -> Json<Vec<shark_post::Model>> {
    let (id, size) = match param {
        Some(Path(params)) => params,
        None => (0, 10),
    };

    let mut posts: Vec<shark_post::Model> = Vec::new();
    for p in 0..size {
        posts.push(shark_post::Model {
            id: id + p,
            ..Default::default()
        });
    }

    return Json(posts);
}

async fn get_post(Path(id): Path<u64>) -> Json<shark_post::Model> {
    let post = shark_post::Model {
        id,
        ..Default::default()
    };
    return Json(post);
}

async fn get_comments(Path(id): Path<u64>) -> Json<Vec<shark_comment::Model>> {
    let comments: Vec<shark_comment::Model> = vec![shark_comment::Model {
        post_id: id,
        ..Default::default()
    }];
    return Json(comments);
}

async fn get_comment(Path(id): Path<u64>, Path(cid): Path<u64>) -> Json<shark_comment::Model> {
    let comment: shark_comment::Model = shark_comment::Model {
        id: cid,
        post_id: id,
        ..Default::default()
    };
    return Json(comment);
}

async fn delete_comment(Path(cid): Path<u64>) -> Json<bool> {
    // let deleted = shark_comment::Entity::delete_by_id(cid).exec(db).await;
    // return Json(deleted.is_ok());
    return Json(true);
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/posts", get(get_posts))
        .route("/posts/:id", get(get_posts))
        .route("/posts/:id/:size", get(get_posts))
        .route("/post/:id", get(get_post))
        .route("/post/:id/comments", get(get_comments))
        .route("/post/:id/comment/:cid", get(get_comment))
        // .route("/post/:id/comment/:cid", post(post_comment))
        .route("/post/:id/comment/:cid", delete(delete_comment))
        // .route("/post/:id/comment/:cid", put(put_comment))
        // .route("/post/:id/comment/:cid", patch(patch_comment))
        .layer(CorsLayer::permissive());

    // Make the service available at http://localhost:8080
    const HOST: &str = "0.0.0.0";
    const PORT: u16 = 8080;
    println!("Listening on http://{HOST}:{PORT}");
    axum::Server::bind(&format!("{}:{}", HOST, PORT).parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
