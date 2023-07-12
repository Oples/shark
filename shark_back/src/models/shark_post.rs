use chrono::Utc;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Clone, Serialize, Deserialize, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "shark_posts")]
#[ts(rename = "SharkPost", export)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: u64,
    pub user_id: String,
    pub img_url: String,
    pub title: String,
    pub location: String,
    pub description: String,
    pub created_at: String,
    pub updated_at: String,
}

impl Default for Model {
    fn default() -> Self {
        Self {
            id: 1,
            user_id: "uuid".to_string(),
            img_url: "https://picsum.photos/200/300".to_string(),
            title: "test".to_string(),
            location: "test".to_string(),
            description: "test".to_string(),
            created_at: Utc::now().to_string(),
            updated_at: Utc::now().to_string(),
        }
    }
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
