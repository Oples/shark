use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .create_table(
                Table::create()
                    .table(SharkPosts::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SharkPosts::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(SharkPosts::UserId).string().null())
                    .col(ColumnDef::new(SharkPosts::ImgUrl).string().not_null())
                    .col(ColumnDef::new(SharkPosts::Title).string().not_null())
                    .col(
                        ColumnDef::new(SharkPosts::LocationLatitude)
                            .float()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(SharkPosts::LocationLongitude)
                            .float()
                            .not_null(),
                    )
                    .col(ColumnDef::new(SharkPosts::Description).string().not_null())
                    .col(ColumnDef::new(SharkPosts::CreatedAt).string().not_null())
                    .col(ColumnDef::new(SharkPosts::UpdatedAt).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .drop_table(Table::drop().table(SharkPosts::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum SharkPosts {
    Table,
    Id,
    UserId,
    ImgUrl,
    Title,
    LocationLatitude,
    LocationLongitude,
    Description,
    CreatedAt,
    UpdatedAt,
}
