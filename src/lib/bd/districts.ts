/**
 * Bangladesh administrative divisions — district + upazila/area picker source.
 * Used by the address form on storefront and shipping-zone builder on admin.
 *
 * Data is intentionally embedded (not external API) for: (1) instant load,
 * (2) zero runtime cost, (3) no network dependency at checkout.
 *
 * Coverage: 8 divisions, 64 districts.
 */

export interface BDDistrict {
  division: string;
  district: string;
  bn: string;
  areas: string[];
}

export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;
export type BDDivision = (typeof BD_DIVISIONS)[number];

export const BD_DISTRICTS: BDDistrict[] = [
  // Dhaka
  { division: "Dhaka", district: "Dhaka", bn: "ঢাকা", areas: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur", "Old Dhaka", "Bashundhara", "Tejgaon", "Motijheel"] },
  { division: "Dhaka", district: "Gazipur", bn: "গাজীপুর", areas: ["Gazipur Sadar", "Tongi", "Kaliakair", "Kapasia", "Sreepur"] },
  { division: "Dhaka", district: "Narayanganj", bn: "নারায়ণগঞ্জ", areas: ["Narayanganj Sadar", "Bandar", "Sonargaon", "Rupganj", "Araihazar"] },
  { division: "Dhaka", district: "Tangail", bn: "টাঙ্গাইল", areas: ["Tangail Sadar", "Mirzapur", "Madhupur"] },
  { division: "Dhaka", district: "Manikganj", bn: "মানিকগঞ্জ", areas: ["Manikganj Sadar", "Saturia", "Singair"] },
  { division: "Dhaka", district: "Munshiganj", bn: "মুন্সিগঞ্জ", areas: ["Munshiganj Sadar", "Sreenagar", "Lohajang"] },
  { division: "Dhaka", district: "Kishoreganj", bn: "কিশোরগঞ্জ", areas: ["Kishoreganj Sadar", "Bhairab", "Bajitpur"] },
  { division: "Dhaka", district: "Narsingdi", bn: "নরসিংদী", areas: ["Narsingdi Sadar", "Madhabdi", "Raipura"] },
  { division: "Dhaka", district: "Faridpur", bn: "ফরিদপুর", areas: ["Faridpur Sadar", "Boalmari", "Bhanga"] },
  { division: "Dhaka", district: "Madaripur", bn: "মাদারীপুর", areas: ["Madaripur Sadar", "Shibchar"] },
  { division: "Dhaka", district: "Gopalganj", bn: "গোপালগঞ্জ", areas: ["Gopalganj Sadar", "Tungipara"] },
  { division: "Dhaka", district: "Rajbari", bn: "রাজবাড়ী", areas: ["Rajbari Sadar", "Goalanda"] },
  { division: "Dhaka", district: "Shariatpur", bn: "শরীয়তপুর", areas: ["Shariatpur Sadar", "Naria"] },

  // Chattogram
  { division: "Chattogram", district: "Chattogram", bn: "চট্টগ্রাম", areas: ["Agrabad", "Khulshi", "Pahartali", "Chawkbazar", "Halishahar", "Kotwali", "Patiya", "Anwara", "Banshkhali"] },
  { division: "Chattogram", district: "Cox's Bazar", bn: "কক্সবাজার", areas: ["Cox's Bazar Sadar", "Teknaf", "Ukhiya", "Chakaria"] },
  { division: "Chattogram", district: "Bandarban", bn: "বান্দরবান", areas: ["Bandarban Sadar", "Lama", "Thanchi"] },
  { division: "Chattogram", district: "Rangamati", bn: "রাঙ্গামাটি", areas: ["Rangamati Sadar", "Kaptai", "Baghaichari"] },
  { division: "Chattogram", district: "Khagrachari", bn: "খাগড়াছড়ি", areas: ["Khagrachari Sadar", "Dighinala"] },
  { division: "Chattogram", district: "Comilla", bn: "কুমিল্লা", areas: ["Comilla Sadar", "Daudkandi", "Laksam"] },
  { division: "Chattogram", district: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", areas: ["Brahmanbaria Sadar", "Kasba"] },
  { division: "Chattogram", district: "Chandpur", bn: "চাঁদপুর", areas: ["Chandpur Sadar", "Hajiganj"] },
  { division: "Chattogram", district: "Lakshmipur", bn: "লক্ষ্মীপুর", areas: ["Lakshmipur Sadar", "Raipur"] },
  { division: "Chattogram", district: "Noakhali", bn: "নোয়াখালী", areas: ["Noakhali Sadar", "Begumganj", "Hatiya"] },
  { division: "Chattogram", district: "Feni", bn: "ফেনী", areas: ["Feni Sadar", "Sonagazi"] },

  // Khulna
  { division: "Khulna", district: "Khulna", bn: "খুলনা", areas: ["Khulna Sadar", "Daulatpur", "Sonadanga", "Khalishpur"] },
  { division: "Khulna", district: "Jessore", bn: "যশোর", areas: ["Jessore Sadar", "Jhikargacha", "Benapole"] },
  { division: "Khulna", district: "Bagerhat", bn: "বাগেরহাট", areas: ["Bagerhat Sadar", "Mongla"] },
  { division: "Khulna", district: "Satkhira", bn: "সাতক্ষীরা", areas: ["Satkhira Sadar", "Kalaroa"] },
  { division: "Khulna", district: "Narail", bn: "নড়াইল", areas: ["Narail Sadar", "Lohagara"] },
  { division: "Khulna", district: "Magura", bn: "মাগুরা", areas: ["Magura Sadar", "Sreepur"] },
  { division: "Khulna", district: "Jhenaidah", bn: "ঝিনাইদহ", areas: ["Jhenaidah Sadar", "Shailkupa"] },
  { division: "Khulna", district: "Kushtia", bn: "কুষ্টিয়া", areas: ["Kushtia Sadar", "Bheramara"] },
  { division: "Khulna", district: "Chuadanga", bn: "চুয়াডাঙ্গা", areas: ["Chuadanga Sadar"] },
  { division: "Khulna", district: "Meherpur", bn: "মেহেরপুর", areas: ["Meherpur Sadar"] },

  // Rajshahi
  { division: "Rajshahi", district: "Rajshahi", bn: "রাজশাহী", areas: ["Boalia", "Shaheb Bazar", "Motihar", "Rajpara"] },
  { division: "Rajshahi", district: "Bogura", bn: "বগুড়া", areas: ["Bogura Sadar", "Sherpur", "Sariakandi"] },
  { division: "Rajshahi", district: "Pabna", bn: "পাবনা", areas: ["Pabna Sadar", "Ishwardi"] },
  { division: "Rajshahi", district: "Sirajganj", bn: "সিরাজগঞ্জ", areas: ["Sirajganj Sadar", "Shahjadpur"] },
  { division: "Rajshahi", district: "Natore", bn: "নাটোর", areas: ["Natore Sadar", "Singra"] },
  { division: "Rajshahi", district: "Naogaon", bn: "নওগাঁ", areas: ["Naogaon Sadar", "Patnitala"] },
  { division: "Rajshahi", district: "Joypurhat", bn: "জয়পুরহাট", areas: ["Joypurhat Sadar", "Akkelpur"] },
  { division: "Rajshahi", district: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ", areas: ["Chapainawabganj Sadar", "Shibganj"] },

  // Barishal
  { division: "Barishal", district: "Barishal", bn: "বরিশাল", areas: ["Barishal Sadar", "Bakerganj", "Banaripara"] },
  { division: "Barishal", district: "Patuakhali", bn: "পটুয়াখালী", areas: ["Patuakhali Sadar", "Kuakata"] },
  { division: "Barishal", district: "Bhola", bn: "ভোলা", areas: ["Bhola Sadar", "Char Fasson"] },
  { division: "Barishal", district: "Pirojpur", bn: "পিরোজপুর", areas: ["Pirojpur Sadar", "Mathbaria"] },
  { division: "Barishal", district: "Barguna", bn: "বরগুনা", areas: ["Barguna Sadar", "Amtali"] },
  { division: "Barishal", district: "Jhalokathi", bn: "ঝালকাঠি", areas: ["Jhalokathi Sadar", "Nalchhiti"] },

  // Sylhet
  { division: "Sylhet", district: "Sylhet", bn: "সিলেট", areas: ["Sylhet Sadar", "Zindabazar", "Beanibazar", "Golapganj"] },
  { division: "Sylhet", district: "Moulvibazar", bn: "মৌলভীবাজার", areas: ["Moulvibazar Sadar", "Sreemangal"] },
  { division: "Sylhet", district: "Habiganj", bn: "হবিগঞ্জ", areas: ["Habiganj Sadar", "Madhabpur"] },
  { division: "Sylhet", district: "Sunamganj", bn: "সুনামগঞ্জ", areas: ["Sunamganj Sadar", "Chhatak"] },

  // Rangpur
  { division: "Rangpur", district: "Rangpur", bn: "রংপুর", areas: ["Rangpur Sadar", "Mithapukur", "Pirgachha"] },
  { division: "Rangpur", district: "Dinajpur", bn: "দিনাজপুর", areas: ["Dinajpur Sadar", "Birganj", "Parbatipur"] },
  { division: "Rangpur", district: "Thakurgaon", bn: "ঠাকুরগাঁও", areas: ["Thakurgaon Sadar", "Pirganj"] },
  { division: "Rangpur", district: "Panchagarh", bn: "পঞ্চগড়", areas: ["Panchagarh Sadar", "Tetulia"] },
  { division: "Rangpur", district: "Nilphamari", bn: "নীলফামারী", areas: ["Nilphamari Sadar", "Saidpur"] },
  { division: "Rangpur", district: "Lalmonirhat", bn: "লালমনিরহাট", areas: ["Lalmonirhat Sadar", "Patgram"] },
  { division: "Rangpur", district: "Kurigram", bn: "কুড়িগ্রাম", areas: ["Kurigram Sadar", "Ulipur"] },
  { division: "Rangpur", district: "Gaibandha", bn: "গাইবান্ধা", areas: ["Gaibandha Sadar", "Sundarganj"] },

  // Mymensingh
  { division: "Mymensingh", district: "Mymensingh", bn: "ময়মনসিংহ", areas: ["Mymensingh Sadar", "Trishal", "Bhaluka", "Muktagachha"] },
  { division: "Mymensingh", district: "Jamalpur", bn: "জামালপুর", areas: ["Jamalpur Sadar", "Sarishabari"] },
  { division: "Mymensingh", district: "Sherpur", bn: "শেরপুর", areas: ["Sherpur Sadar", "Nakla"] },
  { division: "Mymensingh", district: "Netrokona", bn: "নেত্রকোনা", areas: ["Netrokona Sadar", "Mohanganj"] },
];

export const BD_DISTRICT_NAMES = BD_DISTRICTS.map((d) => d.district);

export function getDistrictsByDivision(division: BDDivision): BDDistrict[] {
  return BD_DISTRICTS.filter((d) => d.division === division);
}

export function getAreasForDistrict(district: string): string[] {
  return BD_DISTRICTS.find((d) => d.district === district)?.areas ?? [];
}
