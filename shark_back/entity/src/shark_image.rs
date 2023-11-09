use chrono::Utc;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Clone, Serialize, Deserialize, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "shark_images")]
#[ts(rename = "SharkImage", export)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub post_id: i64, // Foreign Key
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_name: Option<String>,
    #[sea_orm(default = "now()")]
    pub created_at: String,
}

// New SharkImage
#[derive(TS, Clone, Debug, Deserialize, Serialize)]
#[ts(rename = "NewSharkImage", export)]
pub struct NewInsert {
    pub post_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_name: Option<String>,
}

impl Default for Model {
    fn default() -> Self {
        Self {
            id: 1,
            post_id: 1,
            file_name: Some("test.png".to_string()),
            created_at: Utc::now().to_string(),
        }
    }
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::shark_post::Entity",
        from = "Column::PostId",
        to = "super::shark_post::Column::Id"
    )]
    SharkPost,
}

impl Related<super::shark_post::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SharkPost.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
