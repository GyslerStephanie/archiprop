export type OnboardingStackParams = {
  OnboardingSlides: undefined;
  Login: undefined;
};

export type MainTabParams = {
  Home: undefined;
  Navigate: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type HomeStackParams = {
  HomeMain: undefined;
  QRScan: undefined;
  Download: { projectId: string };
  LidarScan: { projectId: string };
  PlaceModel: { projectId: string };
};

export type RootStackParams = {
  Onboarding: undefined;
  Main: undefined;
};
