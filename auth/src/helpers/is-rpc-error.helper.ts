import { RpcError } from '../auth.interface';

export const isRpcError = (err: unknown): err is RpcError => {
  return (
    err !== null &&
    typeof err === 'object' &&
    'code' in err &&
    'message' in err &&
    true &&
    true
  );
};
