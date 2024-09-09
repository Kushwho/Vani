import { FC } from "react";
interface countryCode {
  [key: string]: {
    flag: string;
    code: string;
  };
}
export const countryCodesObject: countryCode = {
  "+1": { flag: "🇺🇸", code: "US" }, // United States, Canada
  "+7": { flag: "🇷🇺", code: "RU" }, // Russia
  "+20": { flag: "🇪🇬", code: "EG" }, // Egypt
  "+27": { flag: "🇿🇦", code: "ZA" }, // South Africa
  "+30": { flag: "🇬🇷", code: "GR" }, // Greece
  "+31": { flag: "🇳🇱", code: "NL" }, // Netherlands
  "+32": { flag: "🇧🇪", code: "BE" }, // Belgium
  "+33": { flag: "🇫🇷", code: "FR" }, // France
  "+34": { flag: "🇪🇸", code: "ES" }, // Spain
  "+36": { flag: "🇭🇺", code: "HU" }, // Hungary
  "+39": { flag: "🇮🇹", code: "IT" }, // Italy
  "+40": { flag: "🇷🇴", code: "RO" }, // Romania
  "+41": { flag: "🇨🇭", code: "CH" }, // Switzerland
  "+44": { flag: "🇬🇧", code: "GB" }, // United Kingdom
  "+45": { flag: "🇩🇰", code: "DK" }, // Denmark
  "+46": { flag: "🇸🇪", code: "SE" }, // Sweden
  "+47": { flag: "🇳🇴", code: "NO" }, // Norway
  "+48": { flag: "🇵🇱", code: "PL" }, // Poland
  "+49": { flag: "🇩🇪", code: "DE" }, // Germany
  "+51": { flag: "🇵🇪", code: "PE" }, // Peru
  "+52": { flag: "🇲🇽", code: "MX" }, // Mexico
  "+53": { flag: "🇨🇺", code: "CU" }, // Cuba
  "+54": { flag: "🇦🇷", code: "AR" }, // Argentina
  "+55": { flag: "🇧🇷", code: "BR" }, // Brazil
  "+56": { flag: "🇨🇱", code: "CL" }, // Chile
  "+57": { flag: "🇨🇴", code: "CO" }, // Colombia
  "+58": { flag: "🇻🇪", code: "VE" }, // Venezuela
  "+60": { flag: "🇲🇾", code: "MY" }, // Malaysia
  "+61": { flag: "🇦🇺", code: "AU" }, // Australia
  "+62": { flag: "🇮🇩", code: "ID" }, // Indonesia
  "+63": { flag: "🇵🇭", code: "PH" }, // Philippines
  "+64": { flag: "🇳🇿", code: "NZ" }, // New Zealand
  "+65": { flag: "🇸🇬", code: "SG" }, // Singapore
  "+66": { flag: "🇹🇭", code: "TH" }, // Thailand
  "+81": { flag: "🇯🇵", code: "JP" }, // Japan
  "+82": { flag: "🇰🇷", code: "KR" }, // South Korea
  "+84": { flag: "🇻🇳", code: "VN" }, // Vietnam
  "+86": { flag: "🇨🇳", code: "CN" }, // China
  "+90": { flag: "🇹🇷", code: "TR" }, // Turkey
  "+91": { flag: "🇮🇳", code: "IN" }, // India
  "+92": { flag: "🇵🇰", code: "PK" }, // Pakistan
  "+93": { flag: "🇦🇫", code: "AF" }, // Afghanistan
  "+94": { flag: "🇱🇰", code: "LK" }, // Sri Lanka
  "+95": { flag: "🇲🇲", code: "MM" }, // Myanmar
  "+98": { flag: "🇮🇷", code: "IR" }, // Iran
  "+212": { flag: "🇲🇦", code: "MA" }, // Morocco
  "+213": { flag: "🇩🇿", code: "DZ" }, // Algeria
  "+216": { flag: "🇹🇳", code: "TN" }, // Tunisia
  "+218": { flag: "🇱🇾", code: "LY" }, // Libya
  "+220": { flag: "🇬🇲", code: "GM" }, // Gambia
  "+221": { flag: "🇸🇳", code: "SN" }, // Senegal
  "+222": { flag: "🇲🇷", code: "MR" }, // Mauritania
  "+223": { flag: "🇲🇱", code: "ML" }, // Mali
  "+224": { flag: "🇬🇳", code: "GN" }, // Guinea
  "+225": { flag: "🇨🇮", code: "CI" }, // Ivory Coast
  "+226": { flag: "🇧🇫", code: "BF" }, // Burkina Faso
  "+227": { flag: "🇳🇪", code: "NE" }, // Niger
  "+228": { flag: "🇹🇬", code: "TG" }, // Togo
  "+229": { flag: "🇧🇯", code: "BJ" }, // Benin
  "+230": { flag: "🇲🇺", code: "MU" }, // Mauritius
  "+231": { flag: "🇱🇷", code: "LR" }, // Liberia
  "+232": { flag: "🇸🇱", code: "SL" }, // Sierra Leone
  "+233": { flag: "🇬🇭", code: "GH" }, // Ghana
  "+234": { flag: "🇳🇬", code: "NG" }, // Nigeria
  "+235": { flag: "🇹🇩", code: "TD" }, // Chad
  "+236": { flag: "🇨🇫", code: "CF" }, // Central African Republic
  "+237": { flag: "🇨🇲", code: "CM" }, // Cameroon
  "+238": { flag: "🇨🇻", code: "CV" }, // Cape Verde
  "+239": { flag: "🇸🇹", code: "ST" }, // São Tomé and Príncipe
  "+240": { flag: "🇬🇶", code: "GQ" }, // Equatorial Guinea
  "+241": { flag: "🇬🇦", code: "GA" }, // Gabon
  "+242": { flag: "🇨🇬", code: "CG" }, // Republic of the Congo
  "+243": { flag: "🇨🇩", code: "CD" }, // Democratic Republic of the Congo
  "+244": { flag: "🇦🇴", code: "AO" }, // Angola
  "+245": { flag: "🇬🇼", code: "GW" }, // Guinea-Bissau
  "+246": { flag: "🇮🇴", code: "IO" }, // British Indian Ocean Territory
  "+247": { flag: "🇦🇨", code: "AC" }, // Ascension Island
  "+248": { flag: "🇸🇨", code: "SC" }, // Seychelles
  "+249": { flag: "🇸🇩", code: "SD" }, // Sudan
  "+250": { flag: "🇷🇼", code: "RW" }, // Rwanda
  "+251": { flag: "🇪🇹", code: "ET" }, // Ethiopia
  "+252": { flag: "🇸🇴", code: "SO" }, // Somalia
  "+253": { flag: "🇩🇯", code: "DJ" }, // Djibouti
  "+254": { flag: "🇰🇪", code: "KE" }, // Kenya
  "+255": { flag: "🇹🇿", code: "TZ" }, // Tanzania
  "+256": { flag: "🇺🇬", code: "UG" }, // Uganda
  "+257": { flag: "🇧🇮", code: "BI" }, // Burundi
  "+258": { flag: "🇲🇿", code: "MZ" }, // Mozambique
  "+260": { flag: "🇿🇲", code: "ZM" }, // Zambia
  "+261": { flag: "🇲🇬", code: "MG" }, // Madagascar
  "+262": { flag: "🇷🇪", code: "RE" }, // Réunion
  "+263": { flag: "🇿🇼", code: "ZW" }, // Zimbabwe
  "+264": { flag: "🇳🇦", code: "NA" }, // Namibia
  "+265": { flag: "🇲🇼", code: "MW" }, // Malawi
  "+266": { flag: "🇱🇸", code: "LS" }, // Lesotho
  "+267": { flag: "🇧🇼", code: "BW" }, // Botswana
  "+268": { flag: "🇸🇿", code: "SZ" }, // Eswatini
  "+269": { flag: "🇰🇲", code: "KM" }, // Comoros
  "+290": { flag: "🇸🇭", code: "SH" }, // Saint Helena
  "+291": { flag: "🇪🇷", code: "ER" }, // Eritrea
  "+297": { flag: "🇦🇼", code: "AW" }, // Aruba
  "+298": { flag: "🇫🇴", code: "FO" }, // Faroe Islands
  "+299": { flag: "🇬🇱", code: "GL" }, // Greenland
  "+350": { flag: "🇬🇮", code: "GI" }, // Gibraltar
  "+351": { flag: "🇵🇹", code: "PT" }, // Portugal
  "+352": { flag: "🇱🇺", code: "LU" }, // Luxembourg
  "+353": { flag: "🇮🇪", code: "IE" }, // Ireland
  "+354": { flag: "🇮🇸", code: "IS" }, // Iceland
  "+355": { flag: "🇦🇱", code: "AL" }, // Albania
  "+356": { flag: "🇲🇹", code: "MT" }, // Malta
  "+357": { flag: "🇨🇾", code: "CY" }, // Cyprus
  "+358": { flag: "🇫🇮", code: "FI" }, // Finland
  "+359": { flag: "🇧🇬", code: "BG" }, // Bulgaria
  "+370": { flag: "🇱🇹", code: "LT" }, // Lithuania
  "+371": { flag: "🇱🇻", code: "LV" }, // Latvia
  "+372": { flag: "🇪🇪", code: "EE" }, // Estonia
  "+373": { flag: "🇲🇩", code: "MD" }, // Moldova
  "+374": { flag: "🇦🇲", code: "AM" }, // Armenia
  "+375": { flag: "🇧🇾", code: "BY" }, // Belarus
  "+376": { flag: "🇦🇩", code: "AD" }, // Andorra
  "+377": { flag: "🇲🇨", code: "MC" }, // Monaco
  "+378": { flag: "🇸🇲", code: "SM" }, // San Marino
  "+379": { flag: "🇻🇦", code: "VA" }, // Vatican City
  "+380": { flag: "🇺🇦", code: "UA" }, // Ukraine
  "+381": { flag: "🇷🇸", code: "RS" }, // Serbia
  "+382": { flag: "🇲🇪", code: "ME" }, // Montenegro
  "+383": { flag: "🇽🇰", code: "XK" }, // Kosovo
  "+385": { flag: "🇭🇷", code: "HR" }, // Croatia
  "+386": { flag: "🇸🇮", code: "SI" }, // Slovenia
  "+387": { flag: "🇧🇦", code: "BA" }, // Bosnia and Herzegovina
  "+389": { flag: "🇲🇰", code: "MK" }, // North Macedonia
  "+420": { flag: "🇨🇿", code: "CZ" }, // Czech Republic
  "+421": { flag: "🇸🇰", code: "SK" }, // Slovakia
  "+423": { flag: "🇱🇮", code: "LI" }, // Liechtenstein
  "+500": { flag: "🇫🇰", code: "FK" }, // Falkland Islands
  "+501": { flag: "🇧🇿", code: "BZ" }, // Belize
  "+502": { flag: "🇬🇹", code: "GT" }, // Guatemala
  "+503": { flag: "🇸🇻", code: "SV" }, // El Salvador
  "+504": { flag: "🇭🇳", code: "HN" }, // Honduras
  "+505": { flag: "🇳🇮", code: "NI" }, // Nicaragua
  "+506": { flag: "🇨🇷", code: "CR" }, // Costa Rica
  "+507": { flag: "🇵🇦", code: "PA" }, // Panama
  "+508": { flag: "🇵🇲", code: "PM" }, // Saint Pierre and Miquelon
  "+509": { flag: "🇭🇹", code: "HT" }, // Haiti
  "+590": { flag: "🇬🇵", code: "GP" }, // Guadeloupe
  "+591": { flag: "🇧🇴", code: "BO" }, // Bolivia
  "+592": { flag: "🇬🇾", code: "GY" }, // Guyana
  "+593": { flag: "🇪🇨", code: "EC" }, // Ecuador
  "+594": { flag: "🇫🇷", code: "GF" }, // French Guiana
  "+595": { flag: "🇵🇾", code: "PY" }, // Paraguay
  "+596": { flag: "🇲🇶", code: "MQ" }, // Martinique
  "+597": { flag: "🇸🇷", code: "SR" }, // Suriname
  "+598": { flag: "🇺🇾", code: "UY" }, // Uruguay
  "+599": { flag: "🇨🇼", code: "CW" }, // Curaçao
  "+670": { flag: "🇹🇱", code: "TL" }, // East Timor
  "+672": { flag: "🇦🇶", code: "AQ" }, // Antarctica
  "+673": { flag: "🇧🇳", code: "BN" }, // Brunei
  "+674": { flag: "🇳🇷", code: "NR" }, // Nauru
  "+675": { flag: "🇵🇬", code: "PG" }, // Papua New Guinea
  "+676": { flag: "🇹🇴", code: "TO" }, // Tonga
  "+677": { flag: "🇸🇧", code: "SB" }, // Solomon Islands
  "+678": { flag: "🇻🇺", code: "VU" }, // Vanuatu
  "+679": { flag: "🇫🇯", code: "FJ" }, // Fiji
  "+680": { flag: "🇵🇼", code: "PW" }, // Palau
  "+681": { flag: "🇼🇫", code: "WF" }, // Wallis and Futuna
  "+682": { flag: "🇨🇰", code: "CK" }, // Cook Islands
  "+683": { flag: "🇳🇺", code: "NU" }, // Niue
  "+685": { flag: "🇼🇸", code: "WS" }, // Samoa
  "+686": { flag: "🇰🇮", code: "KI" }, // Kiribati
  "+687": { flag: "🇳🇨", code: "NC" }, // New Caledonia
  "+688": { flag: "🇹🇻", code: "TV" }, // Tuvalu
  "+689": { flag: "🇵🇫", code: "PF" }, // French Polynesia
  "+690": { flag: "🇹🇰", code: "TK" }, // Tokelau
  "+691": { flag: "🇫🇲", code: "FM" }, // Micronesia
  "+692": { flag: "🇲🇭", code: "MH" }, // Marshall Islands
  "+850": { flag: "🇰🇵", code: "KP" }, // North Korea
  "+852": { flag: "🇭🇰", code: "HK" }, // Hong Kong
  "+853": { flag: "🇲🇴", code: "MO" }, // Macau
  "+855": { flag: "🇰🇭", code: "KH" }, // Cambodia
  "+856": { flag: "🇱🇦", code: "LA" }, // Laos
  "+880": { flag: "🇧🇩", code: "BD" }, // Bangladesh
  "+886": { flag: "🇹🇼", code: "TW" }, // Taiwan
  "+960": { flag: "🇲🇻", code: "MV" }, // Maldives
  "+961": { flag: "🇱🇧", code: "LB" }, // Lebanon
  "+962": { flag: "🇯🇴", code: "JO" }, // Jordan
  "+963": { flag: "🇸🇾", code: "SY" }, // Syria
  "+964": { flag: "🇮🇶", code: "IQ" }, // Iraq
  "+965": { flag: "🇰🇼", code: "KW" }, // Kuwait
  "+966": { flag: "🇸🇦", code: "SA" }, // Saudi Arabia
  "+967": { flag: "🇾🇪", code: "YE" }, // Yemen
  "+968": { flag: "🇴🇲", code: "OM" }, // Oman
  "+970": { flag: "🇵🇸", code: "PS" }, // Palestinian Territories
  "+971": { flag: "🇦🇪", code: "AE" }, // United Arab Emirates
  "+972": { flag: "🇮🇱", code: "IL" }, // Israel
  "+973": { flag: "🇧🇭", code: "BH" }, // Bahrain
  "+974": { flag: "🇶🇦", code: "QA" }, // Qatar
  "+975": { flag: "🇧🇹", code: "BT" }, // Bhutan
  "+976": { flag: "🇲🇳", code: "MN" }, // Mongolia
  "+977": { flag: "🇳🇵", code: "NP" }, // Nepal
  "+992": { flag: "🇹🇯", code: "TJ" }, // Tajikistan
  "+993": { flag: "🇹🇲", code: "TM" }, // Turkmenistan
  "+994": { flag: "🇦🇿", code: "AZ" }, // Azerbaijan
  "+995": { flag: "🇬🇪", code: "GE" }, // Georgia
  "+996": { flag: "🇰🇬", code: "KG" }, // Kyrgyzstan
  "+998": { flag: "🇺🇿", code: "UZ" }, // Uzbekistan
};
const CountryCode: FC = () => {
  return (
    <>
      {Object.keys(countryCodesObject).map(
        (ele: Extract<keyof countryCode, string>) => {
          const currCountry = countryCodesObject[ele];
          return (
            <option value={ele}>
              {ele} {currCountry.flag}
            </option>
          );
        }
      )}
    </>
  );
};

export default CountryCode;
