import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useUpdateDriverStatusMutation,
  useUpdateDriverSubscriptionMutation,
  useDeleteDriverMutation,
} from "../../state/services/admin/adminAPI";
import type { DriverDetailResponse } from "../../types/adminTypes";
import { DriversListTab } from "../../components/AdminDashboard/DriversListTab";
import { EditDriverTab } from "../../components/AdminDashboard/EditDriverTab";
import Loader from "../../components/Loader";
import { Users, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetAllDriversQuery } from "../../state/services/user/userAPI";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { data: drivers, isLoading, isError, refetch } = useGetAllDriversQuery();
  const [selectedDriver, setSelectedDriver] = useState<DriverDetailResponse | null>(null);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateDriverStatusMutation();
  const [updateSubscription, { isLoading: isUpdatingSubscription }] = useUpdateDriverSubscriptionMutation();
  const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

  const handleUpdateStatus = async (active: boolean) => {
    if (!selectedDriver) return;
    try {
      await updateStatus({ driverId: selectedDriver.id, active }).unwrap();
      toast.success(t("adminDashboard.toast.statusSuccess"));
      setSelectedDriver((prev) => (prev ? { ...prev, active } : null));
    } catch (err: any) {
      toast.error(t("adminDashboard.toast.statusFail"));
    }
  };

  const handleUpdateSubscription = async (start: string | null, end: string | null) => {
    if (!selectedDriver) return;
    try {
      await updateSubscription({
        driverId: selectedDriver.id,
        subscriptionStart: start,
        subscriptionEnd: end,
      }).unwrap();
      toast.success(t("adminDashboard.toast.subSuccess"));
      setSelectedDriver((prev) =>
        prev
          ? {
              ...prev,
              subscriptionStart: start || undefined,
              subscriptionEnd: end || undefined,
            }
          : null
      );
    } catch (err: any) {
      toast.error(t("adminDashboard.toast.subFail"));
    }
  };

  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;
    try {
      await deleteDriver(selectedDriver.id).unwrap();
      toast.success(t("adminDashboard.toast.deleteSuccess"));
      setSelectedDriver(null);
      refetch();
    } catch (err: any) {
      toast.error(t("adminDashboard.toast.deleteFail"));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-center font-inter">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-red-50 max-w-lg">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">{t("adminDashboard.error.title")}</h3>
          <p className="text-gray-500 font-medium mb-10">
            {t("adminDashboard.error.desc")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            {t("adminDashboard.error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-inter">
      {/* Admin Dashboard Header Banner */}
      <div className="relative bg-gray-900 pt-20 pb-28 overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] -mr-60 -mt-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[100px] -ml-60 -mb-60 animate-pulse opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 mb-6 inline-block shadow-xl">
            {t("adminDashboard.badge")}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.95] uppercase italic">
            {t("adminDashboard.title").split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
              {t("adminDashboard.title").split(' ').slice(-2).join(' ')}
            </span>
          </h1>
          <p className="text-gray-400 font-bold max-w-xl">
            {t("adminDashboard.desc")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {!selectedDriver ? (
          <div className="space-y-6">
            {/* Quick Stat Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 flex items-center gap-5 max-w-sm">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100/50">
                <Users className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">{drivers?.length || 0}</h4>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  {t("adminDashboard.stats.registered")}
                </p>
              </div>
            </div>

            {/* Drivers Grid Table Tab */}
            <DriversListTab drivers={drivers || []} onSelectDriver={setSelectedDriver} />
          </div>
        ) : (
          /* Configure Tab */
          <EditDriverTab
            driver={selectedDriver}
            onBack={() => {
              setSelectedDriver(null);
              refetch();
            }}
            onUpdateStatus={handleUpdateStatus}
            onUpdateSubscription={handleUpdateSubscription}
            onDeleteDriver={handleDeleteDriver}
            isUpdatingStatus={isUpdatingStatus}
            isUpdatingSubscription={isUpdatingSubscription}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
