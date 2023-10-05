export type IdentityFlow = {
    ujs?: string[];
    num_non_hardware_accounts?: number;
  };

export type IdentityFlowProps = keyof IdentityFlow;
