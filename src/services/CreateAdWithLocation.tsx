// src/components/CreateAdWithLocation.tsx
import React, { useState } from "react";
import { LocationTargetingMap, LocationTarget } from "./LocationTargetingMap";
import { facebookSDK } from "../services/facebookSDK";
import { FacebookPage } from "../types/facebook";

interface Props {
  page: FacebookPage;
}

export const CreateAdWithLocation: React.FC<Props> = ({ page }) => {
  const [locations, setLocations] = useState<LocationTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build targeting spec
      const include = locations
        .filter((l) => !l.exclude)
        .map((l) => ({
          latitude: l.latitude,
          longitude: l.longitude,
          radius: l.radius,
          distance_unit: "kilometer",
          type: "home",
        }));
      const exclude = locations
        .filter((l) => l.exclude)
        .map((l) => ({
          latitude: l.latitude,
          longitude: l.longitude,
          radius: l.radius,
          distance_unit: "kilometer",
          type: "home",
        }));

      const targeting: Record<string, any> = { geo_locations: {} };
      if (include.length) targeting.geo_locations.custom_locations = include;
      if (exclude.length)
        targeting.geo_locations.excluded_custom_locations = exclude;

      const result = await facebookSDK.createAdCampaign(
        page.id,
        page.access_token,
        `Promo for ${page.name}`,
        "100",
        targeting
      );
      // Narrowing unknown to CreateAdResult
      const adRes = result as unknown as {
        campaignId: string;
        adSetId: string;
        creativeId: string;
        adId: string;
      };

      alert(`Ad Created: campaign ${adRes.campaignId}`);
    } catch (err: any) {
      setError(err.message ?? "Advertisement creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LocationTargetingMap
        apiKey="AIzaSyDmzDIeYZ2uxW1L317vDrWJ3zxEP8WB5ps"
        onChange={setLocations}
      />
      <button
        onClick={handleCreate}
        disabled={loading || locations.length === 0}
      >
        {loading ? "Creating..." : "Create Ad with Targeting"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};
