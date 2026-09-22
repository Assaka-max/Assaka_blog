-- =========================================================
--  AssakaBlog 数据库建表语句（纯展示博客，无用户无鉴权）
--  MySQL 8.0+ / utf8mb4
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `assaka_blog`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `assaka_blog`;

-- ---------------------------------------------------------
-- 1. 文章表
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255)    NOT NULL                COMMENT '文章标题',
  `slug`          VARCHAR(255)    NOT NULL                COMMENT 'URL 别名，如 cloudflare-workers-activitypub',
  `summary`       VARCHAR(500)    DEFAULT NULL            COMMENT '摘要（用于 SEO / 列表卡片）',
  `content`       LONGTEXT        NOT NULL                COMMENT '正文 Markdown',
  `status`        TINYINT         NOT NULL DEFAULT 1      COMMENT '状态：0=草稿，1=已发布',
  `view_count`    INT UNSIGNED    NOT NULL DEFAULT 0      COMMENT '浏览量',
  `published_at`  DATETIME        DEFAULT NULL            COMMENT '发布时间（列表按此排序分组）',
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_status_published` (`status`, `published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- ---------------------------------------------------------
-- 2. 标签表
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)     NOT NULL                COMMENT '标签名，如 Vue、serverless',
  `slug`        VARCHAR(50)     NOT NULL                COMMENT 'URL 别名',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ---------------------------------------------------------
-- 3. 文章-标签关联表（多对多）
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `post_tags`;
CREATE TABLE `post_tags` (
  `post_id`  BIGINT UNSIGNED NOT NULL,
  `tag_id`   BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  KEY `idx_tag` (`tag_id`),
  CONSTRAINT `fk_pt_post`
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pt_tag`
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- ---------------------------------------------------------
-- 4. 独立页面表（关于、友链介绍、自定义页）
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255)    NOT NULL                COMMENT '页面标题',
  `slug`        VARCHAR(255)    NOT NULL                COMMENT 'URL 别名，如 about',
  `content`     LONGTEXT        NOT NULL                COMMENT 'Markdown 内容',
  `status`      TINYINT         NOT NULL DEFAULT 1      COMMENT '状态：0=隐藏，1=发布',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='独立页面表';

-- ---------------------------------------------------------
-- 5. 站点配置表（key-value）
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key`         VARCHAR(64)     NOT NULL                COMMENT '配置键，如 site.title',
  `value`       TEXT                                    COMMENT '配置值',
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='站点配置表';

SET FOREIGN_KEY_CHECKS = 1;