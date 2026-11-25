import {
  INSTITUTIONAL_METADATA,
  InstitutionalPortal,
} from "@/components/funnel/InstitutionalPortal";

export const metadata = {
  ...INSTITUTIONAL_METADATA,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <InstitutionalPortal />;
}
