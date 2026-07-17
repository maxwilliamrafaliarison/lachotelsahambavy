import EditorialSplit from "@/components/ui/EditorialSplit";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Teaser restaurant — un EditorialSplit (photo à droite : il suit les trois
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
          imageAlt="Table dressée à la nappe rouge au restaurant panoramique du Lac Hôtel"
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
