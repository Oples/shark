use chrono::Utc;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Clone, Serialize, Deserialize, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "shark_posts")]
#[ts(rename = "SharkPost", export)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub user_id: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location_latitude: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location_longitude: Option<f64>,
    pub description: String,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

// New SharkPost
#[derive(TS, Clone, Debug, Deserialize, Serialize)]
#[ts(rename = "NewSharkPost", export)]
pub struct NewInsert {
    pub user_id: String,
    pub img: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location_latitude: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location_longitude: Option<f64>,
    pub description: String,
}

impl Default for Model {
    fn default() -> Self {
        Self {
            id: 1,
            user_id: "uuid".to_string(),
            title: "test".to_string(),
            location_latitude: Some(51.505),
            location_longitude: Some(-0.09),
            description: "test".to_string(),
            created_at: Utc::now().to_string(),
            updated_at: Some(Utc::now().to_string()),
        }
    }
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
