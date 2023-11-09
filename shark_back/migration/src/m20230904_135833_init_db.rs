use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create Posts table
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
                    .col(ColumnDef::new(SharkPosts::Title).string().not_null())
                    .col(ColumnDef::new(SharkPosts::LocationLatitude).float().null())
                    .col(ColumnDef::new(SharkPosts::LocationLongitude).float().null())
                    .col(ColumnDef::new(SharkPosts::Description).string().not_null())
                    .col(ColumnDef::new(SharkPosts::CreatedAt).date_time().not_null())
                    .col(ColumnDef::new(SharkPosts::UpdatedAt).date_time().null())
                    .to_owned(),
            )
            .await?;

        // Create Images table
        manager
            .create_table(
                Table::create()
                    .table(SharkImages::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SharkImages::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(SharkImages::PostId).integer().not_null())
                    .col(ColumnDef::new(SharkImages::FileName).string())
                    .col(
                        ColumnDef::new(SharkImages::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_shark_image_post_id")
                            .from_tbl(SharkImages::Table)
                            .from_col(SharkImages::PostId)
                            .to_tbl(SharkPosts::Table)
                            .to_col(SharkPosts::Id),
                    )
                    .to_owned(),
            )
            .await?;

        // Create Comments table
        manager
            .create_table(
                Table::create()
                    .table(SharkComments::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SharkComments::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(SharkComments::PostId).integer().not_null())
                    .col(ColumnDef::new(SharkComments::UserId).string().not_null())
                    .col(ColumnDef::new(SharkComments::Content).string().not_null())
                    .col(
                        ColumnDef::new(SharkComments::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .col(ColumnDef::new(SharkComments::UpdatedAt).date_time().null())
                    .col(ColumnDef::new(SharkComments::RemovedAt).date_time().null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_shark_comment_post_id")
                            .from_tbl(SharkComments::Table)
                            .from_col(SharkComments::PostId)
                            .to_tbl(SharkPosts::Table)
                            .to_col(SharkPosts::Id),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .drop_table(Table::drop().table(SharkPosts::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(SharkImages::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(SharkComments::Table).to_owned())
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum SharkPosts {
    Table,
    Id,
    UserId,
    Title,
    LocationLatitude,
    LocationLongitude,
    Description,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum SharkImages {
    Table,
    Id,
    PostId,
    FileName,
    CreatedAt,
}

#[derive(DeriveIden)]
enum SharkComments {
    Table,
    Id,
    PostId,
    UserId,
    Content,
    CreatedAt,
    UpdatedAt,
    RemovedAt,
}
