import React, { ChangeEvent, ChangeEventHandler } from "react";
import CountryCode from "@/Components/Signup/CountryCode.tsx";

interface PhoneNumberInputProps {
  phoneNumber: string;
  countryCode: string;
  onPhoneNumberChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  countryCode,
  onPhoneNumberChange,
  onCountryCodeChange,
}) => {
  const handlePhoneChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onPhoneNumberChange(event.target.value);
  };

  const handleCountryCodeChange: ChangeEventHandler<HTMLSelectElement> = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    onCountryCodeChange(event.target.value);
  };

  return (
    <div className="flex">
      <select
        value={countryCode}
        onChange={handleCountryCodeChange}
        className="w-20 px-2 py-2 border border-orange-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <CountryCode />
      </select>
      <input
        type="number"
        placeholder="Phone number"
        className="flex-1 px-3 py-2 border-t border-b border-r border-orange-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={phoneNumber}
        onChange={handlePhoneChange}
      />
    </div>
  );
};

export default PhoneNumberInput;
