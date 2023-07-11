use std::net::{Ipv4Addr, SocketAddr};

use axum::{
    extract::Path,
    routing::{delete, get, patch, post, put},
    Json, Router,
};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
struct SharkPost {
    id: u64,
    user_id: u64,
    img_url: String,
    title: String,
    location: String,
    description: String,
    created_at: String,
    updated_at: String,
}

impl Default for SharkPost {
    fn default() -> Self {
        Self {
            id: 1,
            user_id: 1,
            img_url: "https://picsum.photos/200/300".to_string(),
            title: "test".to_string(),
            location: "test".to_string(),
            description: "test".to_string(),
            created_at: Utc::now().to_string(),
            updated_at: Utc::now().to_string(),
        }
    }
}

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
struct SharkComment {
    id: u64,
    post_id: u64,
    reply_to: u64,
    user_ip: String,
    content: String,
    created_at: String,
    updated_at: String,
}

impl Default for SharkComment {
    fn default() -> Self {
        Self {
            id: 1,
            post_id: 1,
            reply_to: 1,
            user_ip: Ipv4Addr::new(127, 0, 0, 1).to_string(),
            content: "test".to_string(),
            created_at: Utc::now().to_string(),
            updated_at: Utc::now().to_string(),
        }
    }
}

async fn get_posts() -> Json<Vec<SharkPost>> {
    let posts = vec![SharkPost::default()];
    return Json(posts);
}

async fn get_post(Path(id): Path<u64>) -> Json<SharkPost> {
    let post = SharkPost {
        id,
        ..Default::default()
    };
    return Json(post);
}

async fn get_comments(Path(id): Path<u64>) -> Json<Vec<SharkComment>> {
    let comments = vec![SharkComment::default()];
    return Json(comments);
}

async fn get_comment(Path(id): Path<u64>, Path(cid): Path<u64>) -> Json<SharkComment> {
    let comment = SharkComment {
        id: cid,
        post_id: id,
        ..Default::default()
    };
    return Json(comment);
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/posts", get(get_posts))
        .route("/post/:id", get(get_post))
        .route("/posts/:id/comments", get(get_comments))
        .route("/posts/:id/comments/:cid", get(get_comment))
        // .route("/posts/:id/comments/:cid", post(post_comment))
        // .route("/posts/:id/comments/:cid", delete(delete_comment))
        // .route("/posts/:id/comments/:cid", put(put_comment))
        // .route("/posts/:id/comments/:cid", patch(patch_comment))
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
