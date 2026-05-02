import type { NextRequest } from "next/server";
import {
  BD_DIVISIONS,
  BD_DISTRICTS,
  getDistrictsByDivision,
  getAreasForDistrict,
  type BDDivision,
} from "@/lib/bd/districts";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

/**
 * GET /api/v1/bd/locations
 *   no params       → list of all divisions
 *   ?division=Dhaka → districts in division
 *   ?district=Dhaka → areas/upazilas in district
 *   ?all=true       → entire dataset
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("all") === "true") {
    return apiSuccess({ divisions: BD_DIVISIONS, districts: BD_DISTRICTS });
  }
  const division = sp.get("division");
  if (division) {
    if (!BD_DIVISIONS.includes(division as BDDivision)) {
      return apiError("INVALID_DIVISION", "Invalid division name.", 400);
    }
    return apiSuccess({
      districts: getDistrictsByDivision(division as BDDivision),
    });
  }
  const district = sp.get("district");
  if (district) {
    return apiSuccess({ areas: getAreasForDistrict(district) });
  }
  return apiSuccess({ divisions: BD_DIVISIONS });
}
