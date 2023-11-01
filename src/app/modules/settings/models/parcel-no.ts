export interface ParcelNumberDto {
  Id: string;
  UnitNumber: string;
  PurchaserName: string;
  Email: string;
  ContactNumber: string;
}

export interface CreateParcelRequest {
  UnitNumber: string;
  PurchaserName: string;
  Email: string;
  ContactNumber: string;
}

export interface UpdateParcelRequest extends CreateParcelRequest {
  Id: string;
}
