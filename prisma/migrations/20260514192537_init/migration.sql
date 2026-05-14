-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'deleted', 'suspended');

-- CreateEnum
CREATE TYPE "DriverServiceMode" AS ENUM ('ride_only', 'delivery_only', 'dual_mode', 'rental', 'tour', 'ambulance', 'school');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('online', 'offline', 'busy');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('incomplete', 'complete');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('ride', 'delivery', 'rental', 'tour', 'ambulance', 'school');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('requested', 'driver_assigned', 'driver_arriving', 'arrived', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "JobOfferStatus" AS ENUM ('pending', 'offered', 'accepted', 'rejected', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "DeliveryOrderStatus" AS ENUM ('draft', 'requested', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed');

-- CreateEnum
CREATE TYPE "DeliveryRouteStatus" AS ENUM ('pending', 'pickup_confirmed', 'qr_verified', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('sedan', 'suv', 'hatchback', 'van', 'motorcycle', 'bus', 'ambulance');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('active', 'inactive', 'maintenance', 'retired');

-- CreateEnum
CREATE TYPE "EarningsType" AS ENUM ('trip_fare', 'bonus', 'tip', 'penalty', 'adjustment', 'delivery_fare');

-- CreateEnum
CREATE TYPE "CashoutStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'warning', 'success', 'error');

-- CreateEnum
CREATE TYPE "SafetyEventType" AS ENUM ('temporary_stop', 'safety_check', 'sos');

-- CreateEnum
CREATE TYPE "PricingConfigStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "PromoDiscountType" AS ENUM ('percent', 'flat');

-- CreateEnum
CREATE TYPE "PromoStatus" AS ENUM ('draft', 'active', 'expired');

-- CreateEnum
CREATE TYPE "FeatureFlagScope" AS ENUM ('global', 'rider', 'driver', 'fleet', 'admin');

-- CreateEnum
CREATE TYPE "ApprovalEntityType" AS ENUM ('company', 'driver', 'vehicle', 'document');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('open', 'monitoring', 'resolved');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('under_review', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "FleetDriverStatus" AS ENUM ('invited', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "FleetDispatchStatus" AS ENUM ('pending', 'assigned', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "FleetService" AS ENUM ('rental', 'tour', 'school_shuttle');

-- CreateEnum
CREATE TYPE "FleetServiceStatus" AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "FleetPayoutStatus" AS ENUM ('pending', 'processing', 'paid');

-- CreateEnum
CREATE TYPE "FleetComplianceSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "FleetComplianceStatus" AS ENUM ('open', 'investigating', 'resolved');

-- CreateEnum
CREATE TYPE "FleetTrainingStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "FleetPartnerStatus" AS ENUM ('pending', 'approved', 'suspended');

-- CreateEnum
CREATE TYPE "ServiceRequestType" AS ENUM ('rental', 'tour', 'ambulance');

-- CreateEnum
CREATE TYPE "AdminAgentStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "TrainingModuleStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "PolicyScope" AS ENUM ('global', 'rider', 'driver', 'fleet', 'admin');

-- CreateEnum
CREATE TYPE "VerticalPolicyStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('routine', 'repair', 'inspection', 'tire_change', 'battery_check');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "roles" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "driverId" UUID,
    "riderId" UUID,
    "fleetId" UUID,
    "adminId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "driverId" UUID,
    "fleetId" UUID,
    "branchId" UUID,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "driverLicenseNumber" TEXT,
    "serviceMode" "DriverServiceMode" NOT NULL DEFAULT 'dual_mode',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "checkpoints" JSONB NOT NULL DEFAULT '{}',
    "status" "DriverStatus" NOT NULL DEFAULT 'offline',
    "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'incomplete',
    "currentLocation" geography(Point, 4326),
    "lastLocationAt" TIMESTAMP(3),
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "riderId" UUID,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "preferredCurrency" TEXT NOT NULL DEFAULT 'UGX',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RiderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "department" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetPartnerProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fleetId" UUID,
    "companyName" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "status" "FleetPartnerStatus" NOT NULL DEFAULT 'pending',
    "verticals" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "FleetPartnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetBranch" (
    "id" UUID NOT NULL,
    "fleetPartnerId" UUID NOT NULL,
    "fleetId" UUID,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "managerName" TEXT,
    "operatingHours" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "FleetBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetDriver" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "branchId" UUID,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "status" "FleetDriverStatus" NOT NULL DEFAULT 'invited',
    "serviceModes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetDriver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetDispatch" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "status" "FleetDispatchStatus" NOT NULL DEFAULT 'pending',
    "driverId" UUID,
    "vehicleId" UUID,
    "tripId" UUID,
    "pickup" TEXT NOT NULL,
    "dropoff" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetDispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetServiceRecord" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "service" "FleetService" NOT NULL,
    "status" "FleetServiceStatus" NOT NULL DEFAULT 'pending',
    "customerName" TEXT NOT NULL,
    "assetId" UUID,
    "scheduledAt" BIGINT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetPayout" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "status" "FleetPayoutStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetComplianceIncident" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "FleetComplianceSeverity" NOT NULL DEFAULT 'medium',
    "status" "FleetComplianceStatus" NOT NULL DEFAULT 'open',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetComplianceIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetTrainingCourse" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "FleetTrainingStatus" NOT NULL DEFAULT 'draft',
    "assignedTo" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetTrainingCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "fleetPartnerId" UUID,
    "fleetId" UUID,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "licensePlate" TEXT,
    "type" "VehicleType" NOT NULL DEFAULT 'sedan',
    "status" "VehicleStatus" NOT NULL DEFAULT 'active',
    "accessories" JSONB NOT NULL DEFAULT '{}',
    "documents" JSONB NOT NULL DEFAULT '{}',
    "socPercent" DECIMAL(5,2),
    "estimatedRangeKm" DECIMAL(10,2),
    "currentLocation" geography(Point, 4326),
    "isEv" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" UUID NOT NULL,
    "riderId" UUID NOT NULL,
    "driverId" UUID,
    "fleetPartnerId" UUID,
    "fleetId" UUID,
    "type" "TripType" NOT NULL DEFAULT 'ride',
    "status" "TripStatus" NOT NULL DEFAULT 'requested',
    "pickupLocation" JSONB NOT NULL,
    "dropoffLocation" JSONB NOT NULL,
    "pickup" TEXT,
    "dropoff" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "route" JSONB,
    "fare" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "driverEarnings" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "payment" JSONB,
    "otpCode" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" JSONB,
    "rating" JSONB,
    "driverArrivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripStatusHistory" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "changedBy" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "riderId" UUID,
    "status" "JobOfferStatus" NOT NULL DEFAULT 'pending',
    "type" TEXT,
    "pickup" TEXT,
    "dropoff" TEXT,
    "pickupLocation" JSONB,
    "dropoffLocation" JSONB,
    "estimatedFare" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "route" JSONB,
    "expiresAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryOrder" (
    "id" UUID NOT NULL,
    "riderId" UUID NOT NULL,
    "driverId" UUID,
    "routeId" UUID,
    "status" "DeliveryOrderStatus" NOT NULL DEFAULT 'draft',
    "pickup" JSONB NOT NULL,
    "dropoff" JSONB NOT NULL,
    "items" JSONB,
    "fare" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryRoute" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "status" "DeliveryRouteStatus" NOT NULL DEFAULT 'pending',
    "stops" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsLedger" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "driverId" UUID,
    "type" "EarningsType" NOT NULL DEFAULT 'trip_fare',
    "amount" DECIMAL(10,2) NOT NULL,
    "tripId" UUID,
    "deliveryOrderId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletAccount" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "driverId" UUID,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashoutRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "driverId" UUID,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "CashoutStatus" NOT NULL DEFAULT 'pending',
    "method" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashoutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'rider',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'info',
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyEvent" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "type" "SafetyEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingConfig" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" "PricingConfigStatus" NOT NULL DEFAULT 'active',
    "pricingRules" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingZone" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "boundaries" geometry(Polygon, 4326) NOT NULL,
    "pricingRules" JSONB NOT NULL DEFAULT '{}',
    "status" "PricingConfigStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promo" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discountType" "PromoDiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "status" "PromoStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceConfig" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "scope" "FeatureFlagScope" NOT NULL DEFAULT 'global',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" UUID NOT NULL,
    "entityType" "ApprovalEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "requestedBy" UUID NOT NULL,
    "reviewedBy" UUID,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" BIGINT,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "actorType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" UUID,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskCase" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "severity" "RiskSeverity" NOT NULL DEFAULT 'medium',
    "status" "RiskStatus" NOT NULL DEFAULT 'open',
    "subjectType" TEXT NOT NULL,
    "subjectId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'under_review',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderServiceRequest" (
    "id" UUID NOT NULL,
    "riderId" UUID NOT NULL,
    "driverId" UUID,
    "serviceType" "ServiceRequestType" NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleRoute" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startLocation" JSONB NOT NULL,
    "endLocation" JSONB NOT NULL,
    "stops" JSONB NOT NULL DEFAULT '[]',
    "schedule" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleStudent" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT,
    "parentName" TEXT,
    "parentPhone" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleAttendant" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleAttendant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleTrip" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "driverId" UUID,
    "vehicleId" UUID,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleAttendance" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'present',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttlePayment" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttlePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleFeedback" (
    "id" UUID NOT NULL,
    "fleetId" UUID NOT NULL,
    "tripId" UUID,
    "parentId" UUID,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShuttleFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAgent" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "AdminAgentStatus" NOT NULL DEFAULT 'active',
    "region" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingModule" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "TrainingModuleStatus" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxConfig" (
    "id" UUID NOT NULL,
    "regionId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "vatPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "serviceTaxPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "surchargePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceTemplate" (
    "id" UUID NOT NULL,
    "regionId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "nextNumber" INTEGER NOT NULL DEFAULT 1001,
    "footer" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" "PolicyScope" NOT NULL DEFAULT 'global',
    "status" "PolicyStatus" NOT NULL DEFAULT 'draft',
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerticalPolicy" (
    "id" UUID NOT NULL,
    "verticalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "VerticalPolicyStatus" NOT NULL DEFAULT 'active',
    "rules" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerticalPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleMaintenance" (
    "id" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "fleetId" UUID,
    "type" "MaintenanceType" NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "cost" DECIMAL(10,2),
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" UUID NOT NULL,
    "fleetId" UUID,
    "userId" UUID,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_userId_key" ON "DriverProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_driverId_key" ON "DriverProfile"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_userId_key" ON "RiderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_riderId_key" ON "RiderProfile"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FleetPartnerProfile_userId_key" ON "FleetPartnerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FleetPartnerProfile_fleetId_key" ON "FleetPartnerProfile"("fleetId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletAccount_userId_key" ON "WalletAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Promo_code_key" ON "Promo"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceConfig_key_key" ON "ServiceConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAgent_email_key" ON "AdminAgent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaxConfig_regionId_key" ON "TaxConfig"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_key_key" ON "Policy"("key");

-- CreateIndex
CREATE UNIQUE INDEX "VerticalPolicy_verticalId_key" ON "VerticalPolicy"("verticalId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetPartnerProfile" ADD CONSTRAINT "FleetPartnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetBranch" ADD CONSTRAINT "FleetBranch_fleetPartnerId_fkey" FOREIGN KEY ("fleetPartnerId") REFERENCES "FleetPartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
