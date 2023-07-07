use num_bigint::BigInt;
use ts_rs::TS;

#[derive(TS, Debug)]
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

#[derive(TS, Debug)]
#[ts(export)]
struct SharkPostImage {
    id: u64,
    img_url: String,
}

fn main() {
    println!("Hello, world!");
}
