# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130121092140) do

  create_table "authors", :force => true do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.string "remember_token"
  end

  add_index "authors", ["email"], :name => "index_authors_on_email", :unique => true
  add_index "authors", ["remember_token"], :name => "index_authors_on_remember_token"

  create_table "projects", :force => true do |t|
    t.string "name"
  end

  create_table "statuses", :force => true do |t|
    t.string "name"
  end

  create_table "test_cases", :force => true do |t|
    t.text     "title"
    t.text     "content",    :null => false
    t.integer  "author_id"
    t.integer  "project_id"
    t.integer  "status_id"
    t.datetime "created_at"
  end

end
