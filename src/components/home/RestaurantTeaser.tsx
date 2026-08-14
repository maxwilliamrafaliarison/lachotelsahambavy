import EditorialSplit from "@/components/ui/EditorialSplit";
import { alt } from "@/lib/alt";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Teaser restaurant : un EditorialSplit (photo à droite, car il suit les trois
 * splits alternés de DestinationsTeaser, qui se terminent photo à gauche)
 * avec récapitulatif à filets fins petit-déjeuner / menu.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RestaurantTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const r = dict.restaurantSection;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <EditorialSplit
          image={`${basePath}/images/restaurant/table-dressee-nappe-rouge.jpg`}
          /* La photo est un gros plan de couvert : nappe rouge, verres
             coiffés d'une serviette pliée. Le panorama, qu'annonçait
             l'ancien alt, n'y est pas ; le décrire, c'était promettre à un
             aveugle une vue que l'image ne donne pas. */
          imageAlt={alt(
            {
              fr: "Table dressée à la nappe rouge, serviettes pliées dans les verres à vin",
              en: "Table laid with a red cloth, napkins folded into the wine glasses",
              es: "Mesa puesta con mantel rojo y servilletas dobladas en las copas",
            },
            locale,
          )}
          label={r.label}
          title={r.title}
          reverse
          rows={[
            { label: r.breakfast, value: r.breakfastPrice },
            { label: r.menu, value: r.menuPrice },
          ]}
          cta={{ href: `/${locale}/restaurant/`, label: r.cta }}
        >
          <p>{r.p1}</p>
          <p>{r.p2}</p>
        </EditorialSplit>
      </div>
    </section>
  );
}
