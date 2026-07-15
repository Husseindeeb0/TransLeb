import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { EditDriverTabProps } from "../../types/adminTypes";
import { ShieldCheck, ShieldAlert, Calendar, Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";

export const EditDriverTab: React.FC<EditDriverTabProps> = ({
  driver,
  onBack,
  onUpdateStatus,
  onUpdateSubscription,
  onDeleteDriver,
  isUpdatingStatus,
  isUpdatingSubscription,
  isDeleting,
}) => {
  const { t } = useTranslation();
  const [subStart, setSubStart] = useState("");
  const [subEnd, setSubEnd] = useState("");

  useEffect(() => {
    if (driver.subscriptionStart) {
      setSubStart(new Date(driver.subscriptionStart).toISOString().split("T")[0]);
    } else {
      setSubStart("");
    }

    if (driver.subscriptionEnd) {
      setSubEnd(new Date(driver.subscriptionEnd).toISOString().split("T")[0]);
    } else {
      setSubEnd("");
    }
  }, [driver]);

  const handleSubscriptionSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSubscription(subStart ? new Date(subStart).toISOString() : null, subEnd ? new Date(subEnd).toISOString() : null);
  };

  const handleStatusToggle = () => {
    onUpdateStatus(!driver.active);
  };

  const handleDelete = () => {
    if (window.confirm(t("adminDashboard.edit.deleteConfirm", { name: driver.name }))) {
      onDeleteDriver();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 font-black uppercase tracking-widest text-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("adminDashboard.edit.back")}
      </button>

      {/* Driver Header Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600 p-0.5 shadow-lg">
            {driver.profileImage ? (
              <img src={driver.profileImage} alt={driver.name} className="w-full h-full object-cover rounded-[1.4rem]" />
            ) : (
              <div className="w-full h-full bg-gray-900 rounded-[1.4rem] flex items-center justify-center text-white font-black text-2xl">
                {driver.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{driver.name}</h2>
            <p className="text-sm font-bold text-gray-400">{driver.email}</p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                driver.active
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {driver.active ? t("adminDashboard.edit.activeAccount") : t("adminDashboard.edit.inactiveAccount")}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStatusToggle}
            disabled={isUpdatingStatus}
            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
              driver.active
                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            {isUpdatingStatus ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : driver.active ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                {t("adminDashboard.edit.deactivate")}
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {t("adminDashboard.edit.activate")}
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {t("adminDashboard.edit.deleteAccount")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Subscription Configuration Form */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            {t("adminDashboard.edit.configTitle")}
          </h3>

          <form onSubmit={handleSubscriptionSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  {t("adminDashboard.edit.subStart")}
                </label>
                <input
                  type="date"
                  value={subStart}
                  onChange={(e) => setSubStart(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 font-bold transition-all text-gray-900 bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  {t("adminDashboard.edit.subEnd")}
                </label>
                <input
                  type="date"
                  value={subEnd}
                  onChange={(e) => setSubEnd(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 font-bold transition-all text-gray-900 bg-gray-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingSubscription}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isUpdatingSubscription ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t("adminDashboard.edit.save")}
            </button>
          </form>
        </div>

        {/* Info Column */}
        <div className="bg-gradient-to-br from-red-600 to-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
          <div className="relative z-10">
            <span className="px-3 py-1 bg-white/20 border border-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
              {t("adminDashboard.edit.rulesBadge")}
            </span>
            <h4 className="text-2xl font-black italic uppercase leading-none mb-6">{t("adminDashboard.edit.rulesTitle")}</h4>
            <p className="text-sm font-medium text-white/80 leading-relaxed mb-4">
              {t("adminDashboard.edit.rulesDesc1")}
            </p>
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              {t("adminDashboard.edit.rulesDesc2")}
            </p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/55 mt-8">
            {t("adminDashboard.edit.adminTool")}
          </div>
        </div>
      </div>
    </div>
  );
};
