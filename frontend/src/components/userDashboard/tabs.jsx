import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tab.jsx";
import BookingTrend from "./dashboard_features/BookingTrend.jsx";
import Feedback from "./dashboard_features/Feedback.jsx";
import PaymentHistory from "./dashboard_features/PaymentHistory.jsx";
import Invoices from "./dashboard_features/Invoices.jsx";

export function Tab() {
  return (
    <div className="flex flex-col gap-6 min-h-full w-full">
      <Tabs defaultValue="Booking Trend">
        <TabsList className="gap-10">
          <TabsTrigger value="Booking Trend">Booking Trend</TabsTrigger>
          <TabsTrigger value="Feedback & Ratings">
            Feedback & Ratings
          </TabsTrigger>
          <TabsTrigger value="Payment History">Payment History</TabsTrigger>
          <TabsTrigger value="Invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent className="text-black" value="Booking Trend">
          {" "}
          <BookingTrend />
        </TabsContent>
        <TabsContent className="text-black" value="Feedback & Ratings">
          <Feedback />
        </TabsContent>
        <TabsContent className="text-black" value="Payment History">
          <PaymentHistory />
        </TabsContent>
        <TabsContent className="text-black" value="Invoices">
          <Invoices />
        </TabsContent>
      </Tabs>
    </div>
  );
}
