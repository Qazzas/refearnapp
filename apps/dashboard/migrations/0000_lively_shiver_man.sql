CREATE TABLE "system_settings" (
                                   "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
                                   "installed_version" text DEFAULT '0.1.0' NOT NULL,
                                   "last_updated" timestamp DEFAULT now(),
                                   "latest_available_version" text
);