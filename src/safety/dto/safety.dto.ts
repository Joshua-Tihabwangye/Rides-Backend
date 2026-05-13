import { IsArray, IsIn, IsOptional, IsString, IsNumber } from 'class-validator';

export class TemporaryStopRequestDto {
  @IsOptional()
  @IsString()
  note?: string;
}

export class TemporaryStopRespondDto {
  @IsIn(['confirm', 'decline'])
  decision!: 'confirm' | 'decline';
}

export class SafetyCheckRespondDto {
  @IsIn(['driver', 'passenger'])
  actor!: 'driver' | 'passenger';

  @IsIn(['okay', 'sos'])
  action!: 'okay' | 'sos';
}

export class SosDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contactsNotified?: string[];

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  helpMessage?: string;
}

export class EmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  relationship?: string;
}
