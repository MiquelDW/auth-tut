// catch-all route that matches any url path and captures the segments in array 'nextauth'
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
