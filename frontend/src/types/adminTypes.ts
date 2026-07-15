export interface DriverDetailResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  region?: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  active: boolean;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDriverStatusRequest {
  driverId: string;
  active: boolean;
}

export interface UpdateDriverSubscriptionRequest {
  driverId: string;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
}

export interface DriversListTabProps {
  drivers: DriverDetailResponse[];
  onSelectDriver: (driver: DriverDetailResponse) => void;
}

export interface EditDriverTabProps {
  driver: DriverDetailResponse;
  onBack: () => void;
  onUpdateStatus: (active: boolean) => Promise<void>;
  onUpdateSubscription: (start: string | null, end: string | null) => Promise<void>;
  onDeleteDriver: () => Promise<void>;
  isUpdatingStatus: boolean;
  isUpdatingSubscription: boolean;
  isDeleting: boolean;
}
