import { Inngest } from 'inngest';

// NOTE: Inngest v4 dropped the old EventSchemas().fromRecord<>() typed-events
// helper. Event payloads are typed at each call site (send/functions.ts)
// instead of globally on the client.
export const inngest = new Inngest({ id: 'ai-shorts-factory' });
