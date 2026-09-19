"""
Rize Passport - synthetic data generator  (v2, HS/HSN code layer added)
Merchant: Kaya Naturals, Bengaluru D2C skincare, ~Rs 4.2cr revenue
"""

import json, random, os
from datetime import date

rng = random.Random(19092026)      # main stream - identical to v1
sku_rng = random.Random(77042026)  # separate stream for line items

OUT = "public/data"
os.makedirs(OUT, exist_ok=True)

MONTHS = [(2025, m) for m in range(10, 13)] + [(2026, m) for m in range(1, 10)]
INTL_LIVE_FROM = (2026, 6)

PRODUCTS = [
    {"sku": "KN-SER-30",  "name": "Vitamin C Face Serum 30ml",   "hsn_4": "3304", "hs_6": "3304.99", "itc_hs_8": "33049990", "mrp_inr": 1450, "rev_share": 0.32},
    {"sku": "KN-MOI-50",  "name": "Ceramide Moisturiser 50g",    "hsn_4": "3304", "hs_6": "3304.99", "itc_hs_8": "33049990", "mrp_inr": 1150, "rev_share": 0.24},
    {"sku": "KN-SUN-50",  "name": "Mineral Sunscreen SPF50 50g", "hsn_4": "3304", "hs_6": "3304.99", "itc_hs_8": "33049990", "mrp_inr":  950, "rev_share": 0.16},
    {"sku": "KN-HRO-100", "name": "Rosemary Hair Oil 100ml",     "hsn_4": "3305", "hs_6": "3305.90", "itc_hs_8": "33059019", "mrp_inr":  720, "rev_share": 0.18},
    {"sku": "KN-SOP-100", "name": "Neem Cleansing Bar 100g",     "hsn_4": "3401", "hs_6": "3401.11", "itc_hs_8": "34011190", "mrp_inr":  320, "rev_share": 0.10},
]
SKU_BY_ID = {p["sku"]: p for p in PRODUCTS}
SKU_IDS = [p["sku"] for p in PRODUCTS]
SKU_WEIGHTS = [p["rev_share"] for p in PRODUCTS]

COUNTRIES = [
    ("United States",        "US", 400, 0.86, 4200, 1.00),
    ("United Arab Emirates", "AE", 230, 0.88, 2100, 0.45),
    ("United Kingdom",       "GB",  60, 0.84, 2900, 0.30),
    ("Canada",               "CA",  34, 0.85, 3600, 0.20),
    ("Australia",            "AU",  26, 0.85, 3400, 0.15),
    ("Singapore",            "SG",  22, 0.83, 3100, 0.18),
    ("Germany",              "DE",  12, 0.87, 3300, 0.08),
    ("Netherlands",          "NL",   9, 0.87, 3200, 0.06),
    ("New Zealand",          "NZ",   7, 0.86, 3000, 0.05),
]

DECLINE_REASONS = [
    ("INTERNATIONAL_NOT_ENABLED", 0.62),
    ("ISSUER_DECLINED_CROSS_BORDER", 0.18),
    ("3DS_AUTH_FAILED", 0.14),
    ("CURRENCY_NOT_SUPPORTED", 0.06),
]
CARD_NETWORKS = ["visa", "mastercard", "amex"]

def pick_reason():
    r = rng.random()
    c = 0.0
    for name, w in DECLINE_REASONS:
        c += w
        if r <= c:
            return name
    return DECLINE_REASONS[0][0]

def month_weight(idx, trend):
    return (1.0 + trend * (idx / len(MONTHS))) * rng.uniform(0.85, 1.15)

def intl_live(y, m):
    return (y, m) >= INTL_LIVE_FROM

def build_cart(target_inr):
    items, total, guard = [], 0, 0
    while total < target_inr * 0.78 and guard < 8:
        guard += 1
        sku = sku_rng.choices(SKU_IDS, weights=SKU_WEIGHTS, k=1)[0]
        p = SKU_BY_ID[sku]
        if total + p["mrp_inr"] > target_inr * 1.18:
            continue
        existing = next((i for i in items if i["sku"] == sku), None)
        if existing:
            existing["qty"] += 1
            existing["line_inr"] += p["mrp_inr"]
        else:
            items.append({"sku": sku, "name": p["name"], "hsn_4": p["hsn_4"],
                          "hs_6": p["hs_6"], "qty": 1, "line_inr": p["mrp_inr"]})
        total += p["mrp_inr"]
    if not items:
        p = SKU_BY_ID["KN-SOP-100"]
        items = [{"sku": p["sku"], "name": p["name"], "hsn_4": p["hsn_4"],
                  "hs_6": p["hs_6"], "qty": 1, "line_inr": p["mrp_inr"]}]
    return items

attempts = []
attempt_id = 100000

for name, iso, total, base_decline, mean_cart, trend in COUNTRIES:
    weights = [month_weight(i, trend) for i in range(len(MONTHS))]
    tw = sum(weights)
    for i, (y, m) in enumerate(MONTHS):
        n = round(total * weights[i] / tw)
        decline_rate = base_decline if not intl_live(y, m) else base_decline - 0.34
        for _ in range(n):
            attempt_id += 1
            day = rng.randint(1, 28)
            cart = int(rng.gauss(mean_cart, mean_cart * 0.22))
            cart = max(600, round(cart / 50) * 50)
            declined = rng.random() < decline_rate
            network = rng.choice(CARD_NETWORKS)
            reason = pick_reason() if declined else None
            fingerprint = f"{iso}-{rng.randint(1, max(6, int(total*0.55)))}"
            attempts.append({
                "attempt_id": f"pay_{attempt_id}",
                "date": date(y, m, day).isoformat(),
                "issuing_country": iso,
                "issuing_country_name": name,
                "card_network": network,
                "cart_value_inr": cart,
                "line_items": build_cart(cart),
                "status": "failed" if declined else "captured",
                "failure_reason": reason,
                "buyer_fingerprint": fingerprint,
            })

attempts.sort(key=lambda a: a["date"])

domestic = []
base_gmv = 2650000
for i, (y, m) in enumerate(MONTHS):
    gmv = int(base_gmv * (1 + 0.018 * i) * rng.uniform(0.94, 1.07))
    orders = int(gmv / rng.uniform(1780, 1930))
    by_hsn = {}
    for p in PRODUCTS:
        by_hsn[p["hsn_4"]] = by_hsn.get(p["hsn_4"], 0) + int(gmv * p["rev_share"])
    domestic.append({
        "month": f"{y}-{m:02d}",
        "gmv_inr": gmv,
        "orders": orders,
        "aov_inr": round(gmv / orders),
        "refund_rate": round(rng.uniform(0.036, 0.048), 4),
        "settlement_currency": "INR",
        "gmv_by_hsn": by_hsn,
    })

outward = []
for i, (y, m) in enumerate(MONTHS):
    outward.append({
        "month": f"{y}-{m:02d}",
        "meta_ads_usd_geo_targeted": round(rng.uniform(180, 420) * (1 + 0.09 * i), 2),
        "meta_ads_geos": ["US", "AE"] if i < 6 else ["US", "AE", "GB"],
        "saas_usd": round(rng.uniform(240, 310), 2),
        "overseas_contractor_usd": 0 if i < 7 else round(rng.uniform(400, 900), 2),
        "notes": "USD outflow targeting foreign geographies is a pre-export signal",
    })

def rollup():
    by_country = {}
    for a in attempts:
        c = by_country.setdefault(a["issuing_country"], {
            "country": a["issuing_country"], "country_name": a["issuing_country_name"],
            "attempts": 0, "declined": 0, "captured": 0,
            "declined_value_inr": 0, "captured_value_inr": 0,
            "cart_values": [], "buyers": {}, "hs_value": {},
        })
        c["attempts"] += 1
        c["cart_values"].append(a["cart_value_inr"])
        c["buyers"][a["buyer_fingerprint"]] = c["buyers"].get(a["buyer_fingerprint"], 0) + 1
        for li in a["line_items"]:
            c["hs_value"][li["hs_6"]] = c["hs_value"].get(li["hs_6"], 0) + li["line_inr"]
        if a["status"] == "failed":
            c["declined"] += 1
            c["declined_value_inr"] += a["cart_value_inr"]
        else:
            c["captured"] += 1
            c["captured_value_inr"] += a["cart_value_inr"]

    out = []
    for c in by_country.values():
        cv = sorted(c["cart_values"])
        repeat = sum(1 for v in c["buyers"].values() if v > 1)
        hs_total = sum(c["hs_value"].values()) or 1
        hs_mix = sorted(
            [{"hs_6": k, "value_inr": v, "share": round(v / hs_total, 4)}
             for k, v in c["hs_value"].items()],
            key=lambda x: -x["value_inr"])
        out.append({
            "country": c["country"], "country_name": c["country_name"],
            "attempts": c["attempts"], "declined": c["declined"],
            "decline_rate": round(c["declined"] / c["attempts"], 4),
            "leaked_inr": c["declined_value_inr"],
            "captured_inr": c["captured_value_inr"],
            "attempted_aov_inr": round(sum(cv) / len(cv)),
            "max_accepted_cart_inr": max(cv),
            "unique_buyers": len(c["buyers"]),
            "repeat_buyers": repeat,
            "repeat_rate": round(repeat / len(c["buyers"]), 4),
            "hs_mix": hs_mix,
            "dominant_hs_6": hs_mix[0]["hs_6"],
        })
    out.sort(key=lambda x: -x["leaked_inr"])
    return out

by_country = rollup()
total_attempts = sum(c["attempts"] for c in by_country)
total_declined = sum(c["declined"] for c in by_country)
total_leaked = sum(c["leaked_inr"] for c in by_country)
dom_aov = round(sum(d["gmv_inr"] for d in domestic) / sum(d["orders"] for d in domestic))

annual_gmv = sum(d["gmv_inr"] for d in domestic)
hsn_profile = {}
for p in PRODUCTS:
    e = hsn_profile.setdefault(p["hsn_4"], {
        "hsn_4": p["hsn_4"], "hs_6": p["hs_6"], "itc_hs_8": p["itc_hs_8"],
        "domestic_gmv_inr": 0, "skus": []})
    e["domestic_gmv_inr"] += int(annual_gmv * p["rev_share"])
    e["skus"].append({"sku": p["sku"], "name": p["name"], "mrp_inr": p["mrp_inr"]})
hsn_profile = sorted(hsn_profile.values(), key=lambda x: -x["domestic_gmv_inr"])
for e in hsn_profile:
    e["share_of_revenue"] = round(e["domestic_gmv_inr"] / annual_gmv, 4)

summary = {
    "merchant": {
        "name": "Kaya Naturals", "city": "Bengaluru", "category": "D2C personal care",
        "annual_revenue_inr": annual_gmv,
        "net_worth_inr": 11000000,
        "gross_margin": 0.58,
        "international_payments_enabled_from": "2026-06",
        "gst_hsn_reporting_digits": 4,
        "gst_hsn_reporting_note": "Turnover of Rs 4.2cr sits under the Rs 5cr threshold, so GST invoices carry 4-digit HSN. Export shipping bills require 8 digits. Rize Passport bridges that.",
    },
    "headline": {
        "leaked_inr": total_leaked,
        "leaked_display": f"Rs {total_leaked/100000:.1f}L",
        "total_attempts": total_attempts,
        "declined": total_declined,
        "decline_rate": round(total_declined / total_attempts, 4),
        "countries": len(by_country),
        "domestic_aov_inr": dom_aov,
    },
    "hsn_profile": hsn_profile,
    "by_country": by_country,
}

for fn, obj in [("attempts.json", attempts), ("domestic.json", domestic),
                ("outward.json", outward), ("summary.json", summary)]:
    with open(os.path.join(OUT, fn), "w") as f:
        json.dump(obj, f, indent=2)
