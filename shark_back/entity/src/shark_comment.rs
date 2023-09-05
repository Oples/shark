use chrono::Utc;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::net::Ipv4Addr;
use ts_rs::TS;

#[derive(TS, Debug, Clone, Serialize, Deserialize, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "shark_posts")]
#[ts(rename = "SharkComment", export)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(
        belongs_to = "shark_post::Entity",
        from = "Column::PostId",
        to = "shark_post::Column::Id"
    )]
    pub post_id: i64,
    pub reply_to: i64,
    pub user_ip: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

impl Default for Model {
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

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
