import { ExpandableRow } from 'src/app/core/models/sharedModels';
import { ParcelNumberDto } from '../../settings/models/parcelNumberModels';

export interface IOTSetupTransDto extends ExpandableRow {
  Success: any;
  Data: any;
  Id: string;
  ServiceNumber: string;
  Date: Date;
  ParcelNumber?: ParcelNumberDto;
  SmartDoorLock: boolean;
  SmartDoorbell: boolean;
  SmartCurtain: boolean;
  SmartSwitches: boolean;
  Gateway: boolean;
  IRBlaster: boolean;
  IRBlasterSerial: string;
  RGBLightStrip: boolean;
  SmartSpeaker: boolean;
  SmartSpeakerSerial: string;
  SmartTv: boolean;
  Handbook: boolean;
  Remark: string;
  Signature: string;
}

export interface CreateIotRequest {
  ParcelNumberId: string;
  SmartDoorLock: boolean;
  SmartDoorbell: boolean;
  SmartCurtain: boolean;
  SmartSwitches: boolean;
  Gateway: boolean;
  IRBlaster: boolean;
  IRBlasterSerial: string;
  RGBLightStrip: boolean;
  SmartSpeaker: boolean;
  SmartSpeakerSerial: string;
  SmartTv: boolean;
  Handbook: boolean;
  Remark: string;
  Signature: string;
}

export interface UpdateIotRequest {
  Id: string;
  IRBlasterSerial: string;
  SmartSpeakerSerial: string;
  Remark: string;
}
