CREATE TYPE "public"."mode_paiement" AS ENUM('especes', 'cheque', 'virement_mga', 'virement_eur', 'mvola', 'autre');--> statement-breakpoint
CREATE TYPE "public"."source_document" AS ENUM('import_2026', 'outil');--> statement-breakpoint
CREATE TYPE "public"."type_document" AS ENUM('PROFORMA', 'FACTURE', 'AVOIR');--> statement-breakpoint
CREATE TABLE "agences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"nif" text,
	"stat" text,
	"adresse" text,
	"email" text,
	"pays" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agences_nom_unique" UNIQUE("nom")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "type_document" NOT NULL,
	"numero" text,
	"annee" integer,
	"agence_id" uuid,
	"sejour_id" uuid,
	"document_origine_id" uuid,
	"date_emission" date,
	"devise" text DEFAULT 'MGA' NOT NULL,
	"taux_eur" integer,
	"exoneration" boolean DEFAULT false NOT NULL,
	"sous_total_ht" bigint,
	"tva" bigint,
	"vignette" bigint,
	"remise" bigint,
	"total_ttc" bigint,
	"montant_ca" bigint,
	"source" "source_document" DEFAULT 'outil' NOT NULL,
	"fichier_source" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents_meta" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"brut" jsonb
);
--> statement-breakpoint
CREATE TABLE "lignes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"nombre" integer,
	"designation" text NOT NULL,
	"pu" bigint,
	"nuitees" integer,
	"total" bigint,
	"soumis_tva" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paiements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"mode" "mode_paiement" NOT NULL,
	"montant" bigint NOT NULL,
	"devise" text DEFAULT 'MGA' NOT NULL,
	"date_encaissement" date,
	"reference" text,
	"mention_brute" text
);
--> statement-breakpoint
CREATE TABLE "sejours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agence_id" uuid,
	"client" text,
	"code_groupe" text,
	"date_in" date,
	"date_out" date,
	"nuits" integer,
	"pax" integer,
	"pax_brut" text,
	"formule" text
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_agence_id_agences_id_fk" FOREIGN KEY ("agence_id") REFERENCES "public"."agences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_sejour_id_sejours_id_fk" FOREIGN KEY ("sejour_id") REFERENCES "public"."sejours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_meta" ADD CONSTRAINT "documents_meta_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lignes" ADD CONSTRAINT "lignes_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sejours" ADD CONSTRAINT "sejours_agence_id_agences_id_fk" FOREIGN KEY ("agence_id") REFERENCES "public"."agences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documents_type_idx" ON "documents" USING btree ("type");--> statement-breakpoint
CREATE INDEX "documents_agence_idx" ON "documents" USING btree ("agence_id");--> statement-breakpoint
CREATE INDEX "documents_annee_idx" ON "documents" USING btree ("annee");--> statement-breakpoint
CREATE INDEX "sejours_date_in_idx" ON "sejours" USING btree ("date_in");