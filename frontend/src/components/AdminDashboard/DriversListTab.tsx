import React from "react";
import { useTranslation } from "react-i18next";
import type { DriversListTabProps } from "../../types/adminTypes";
import { ShieldCheck, ShieldAlert, Calendar, Mail, Phone, ArrowRight } from "lucide-react";

export const DriversListTab: React.FC<DriversListTabProps> = ({ drivers, onSelectDriver }) => {
  const { t } = useTranslation();
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white font-inter">
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider italic">{t("adminDashboard.list.driverInfo")}</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-wider italic">{t("adminDashboard.list.email")}</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-wider italic">{t("adminDashboard.list.phone")}</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-wider italic text-center">{t("adminDashboard.list.status")}</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-wider italic">{t("adminDashboard.list.subscription")}</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-wider italic text-right">{t("adminDashboard.list.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-inter">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-gray-400 font-bold">
                  {t("adminDashboard.list.noDrivers")}
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600 p-0.5 flex-shrink-0 shadow-md">
                        {driver.profileImage ? (
                          <img
                            src={driver.profileImage}
                            alt={driver.name}
                            className="w-full h-full object-cover rounded-[0.9rem]"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 rounded-[0.9rem] flex items-center justify-center text-white font-black text-sm">
                            {driver.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-base">{driver.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                          {driver.region || t("adminDashboard.list.noRegion")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {driver.email}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {driver.phoneNumber || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        driver.active
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {driver.active ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {t("adminDashboard.list.active")}
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {t("adminDashboard.list.inactive")}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(driver.subscriptionStart)} - {formatDate(driver.subscriptionEnd)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => onSelectDriver(driver)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      {t("adminDashboard.list.configure")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
