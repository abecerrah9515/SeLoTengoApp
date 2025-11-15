
-- Se lo tengo App - ER Model (Draft v0.1)
-- Engine target: PostgreSQL 15+ (UUIDs, partial indexes, JSONB for flexible attrs)
-- Note: Adjust data types and constraints per your DB of choice.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Reference tables
CREATE TABLE campus (
    campus_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE program (
    program_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    faculty TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE category (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID NULL REFERENCES category(category_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_category_parent ON category(parent_id);

CREATE TABLE tag (
    tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

-- 1. Identity & Access
CREATE TABLE app_user (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_email TEXT UNIQUE,
    personal_email TEXT,
    phone TEXT,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student', -- student|teacher|admin|staff|alumni
    campus_id UUID REFERENCES campus(campus_id) ON DELETE SET NULL,
    program_id UUID REFERENCES program(program_id) ON DELETE SET NULL,
    semester_smallint SMALLINT, -- nullable if not a student
    is_verified BOOLEAN NOT NULL DEFAULT FALSE, -- identity verification
    reputation_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_campus ON app_user(campus_id);
CREATE INDEX idx_user_program ON app_user(program_id);

CREATE TABLE user_verification (
    verification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    method TEXT NOT NULL, -- institutional_email, manual_review, oauth_adb2c, etc.
    status TEXT NOT NULL, -- pending|approved|rejected
    reviewed_by UUID REFERENCES app_user(user_id) ON DELETE SET NULL, -- admin
    evidence_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);
CREATE INDEX idx_user_verification_user ON user_verification(user_id);

CREATE TABLE user_block (
    blocker_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- 2. Listings (offers / requests)
CREATE TABLE listing (
    listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES category(category_id) ON DELETE RESTRICT,
    type TEXT NOT NULL, -- offer | request
    title TEXT NOT NULL,
    description TEXT,
    campus_id UUID REFERENCES campus(campus_id) ON DELETE SET NULL,
    location_geo JSONB, -- { lat, lng } if needed later
    price_cop INTEGER, -- nullable if not applicable
    allow_negotiation BOOLEAN NOT NULL DEFAULT TRUE,
    condition TEXT, -- new|used|na
    status TEXT NOT NULL DEFAULT 'active', -- active|paused|closed|moderation
    attributes JSONB, -- flexible: { "author":"", "edition":"", "size":"", ... }
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listing_owner ON listing(owner_id);
CREATE INDEX idx_listing_category ON listing(category_id);
CREATE INDEX idx_listing_campus ON listing(campus_id);
CREATE INDEX idx_listing_status ON listing(status);
CREATE INDEX idx_listing_search ON listing USING GIN (to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(description,'')));
CREATE INDEX idx_listing_attrs ON listing USING GIN (attributes);

CREATE TABLE listing_media (
    media_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(listing_id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    media_type TEXT NOT NULL, -- image|video|doc
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listing_media_listing ON listing_media(listing_id);

CREATE TABLE listing_tag (
    listing_id UUID NOT NULL REFERENCES listing(listing_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tag(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, tag_id)
);

CREATE TABLE favorite (
    user_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listing(listing_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, listing_id)
);

-- 3. Matching → Applications & Agreements
CREATE TABLE application (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(listing_id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending|accepted|declined|withdrawn
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    decision_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_application_unique ON application(listing_id, applicant_id);

CREATE TABLE agreement (
    agreement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(listing_id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    counterparty_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE, -- accepted applicant or listing owner (for requests)
    application_id UUID REFERENCES application(application_id) ON DELETE SET NULL,
    agreed_price_cop INTEGER,
    meet_time TIMESTAMPTZ,
    meet_place TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active|completed|cancelled|disputed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_agreement_listing ON agreement(listing_id);
CREATE INDEX idx_agreement_status ON agreement(status);

-- 4. Messaging
CREATE TABLE chat_thread (
    thread_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listing(listing_id) ON DELETE SET NULL, -- optional link
    agreement_id UUID REFERENCES agreement(agreement_id) ON DELETE SET NULL, -- post-match
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_participant (
    thread_id UUID NOT NULL REFERENCES chat_thread(thread_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE chat_message (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES chat_thread(thread_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    body TEXT,
    attachments JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_message_thread ON chat_message(thread_id);

-- 5. Trust & Safety
CREATE TABLE review (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES agreement(agreement_id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    rating_smallint SMALLINT NOT NULL CHECK (rating_smallint BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (agreement_id, reviewer_id)
);
CREATE INDEX idx_review_reviewee ON review(reviewee_id);

CREATE TABLE report (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, -- user|listing|message|agreement
    target_id UUID NOT NULL,   -- FK enforced via app logic
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- open|under_review|action_taken|dismissed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    notes TEXT
);
CREATE INDEX idx_report_target ON report(target_type, target_id);
CREATE INDEX idx_report_status ON report(status);

-- 6. Notifications
CREATE TABLE notification (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- new_message|new_application|status_change|safety_alert|reminder
    payload JSONB NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_notification_unread ON notification(user_id, is_read) WHERE is_read = FALSE;

-- 7. (Optional/Futuro) Pagos
CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES agreement(agreement_id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    payee_id UUID NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    method TEXT, -- pse|card|cash|other
    amount_cop INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'initiated', -- initiated|confirmed|failed|refunded
    provider_ref TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ
);

-- 8. Auditing
CREATE TABLE audit_log (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES app_user(user_id) ON DELETE SET NULL,
    object_type TEXT NOT NULL,
    object_id UUID,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
