"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon, ShieldCheckIcon, Loader2Icon } from "lucide-react"
import { sendOtp, verifyOtp } from "@/services/api"

const steps = [
  { id: 1, label: "Your Name",    field: "name",     placeholder: "Full name" },
  { id: 2, label: "Phone Number", field: "phone",    placeholder: "+1 (555) 000-0000" },
  { id: 3, label: "Email",        field: "email",    placeholder: "you@example.com" },
  { id: 4, label: "Service",      field: "service",  placeholder: "e.g. Split AC Cleaning" },
  { id: 5, label: "Preferred Date", field: "date",   placeholder: "Select a date" },
]

export function MultiStepForm({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData,    setFormData]    = useState({})
  const [isComplete,  setIsComplete]  = useState(false)
  const [isOtpStep,   setIsOtpStep]   = useState(false)
  const [otp,         setOtp]         = useState("")
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState("")

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Last step reached, send OTP
      setLoading(true)
      setError("")
      try {
        await sendOtp({ email: formData.email, name: formData.name })
        setIsOtpStep(true)
      } catch (err) {
        setError(err.message || "Failed to send verification code.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    setError("")
    try {
      await verifyOtp({ email: formData.email, otp: otp })
      setIsComplete(true)
      onSuccess?.(formData)
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const currentStepData = steps[currentStep]
  const progress = isOtpStep ? 100 : ((currentStep + 1) / steps.length) * 100

  /* ── Success state ── */
  if (isComplete) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-12 backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,78,219,0.12),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-4" style={{ animation: 'fadeInScale 0.6s ease-out both' }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500/20 bg-blue-500/10">
              <CheckIcon className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-semibold tracking-tight">Booking Confirmed! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                Thanks, <strong>{formData.name}</strong>! Your email has been verified. We'll call you at{" "}
                <strong>{formData.phone}</strong> within 2 hours.
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-1 w-full text-xs text-muted-foreground bg-muted/30 rounded-xl p-4">
              {Object.entries(formData).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="capitalize font-medium">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── OTP Verification Step ── */
  if (isOtpStep) {
    return (
      <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
            <p className="text-sm text-gray-500">
              We've sent a 6-digit code to <br />
              <span className="font-medium text-gray-900">{formData.email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp-input" className="text-sm font-medium text-gray-700">Verification Code</Label>
              <Input
                id="otp-input"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-14 text-center text-2xl tracking-[0.5em] font-mono border-gray-200 bg-gray-50 focus-visible:border-blue-400 focus-visible:ring-blue-200/50"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300"
            >
              {loading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                "Verify & Confirm Booking"
              )}
            </Button>

            <button
              onClick={() => { setIsOtpStep(false); setOtp(""); setError(""); }}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              ← Edit email or details
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Regular Form steps ── */
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={cn(
                "group relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ease-out",
                "disabled:cursor-not-allowed",
                index < currentStep  && "bg-blue-100 text-blue-600",
                index === currentStep && "bg-blue-600 text-white shadow-[0_0_16px_-4px_rgba(37,78,219,0.5)]",
                index > currentStep  && "bg-gray-100 text-gray-400",
              )}
            >
              {index < currentStep ? (
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <span className="tabular-nums">{step.id}</span>
              )}
              {index === currentStep && (
                <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-sm animate-pulse" />
              )}
            </button>
            {index < steps.length - 1 && (
              <div className="relative h-[1.5px] w-8">
                <div className="absolute inset-0 bg-gray-200" />
                <div
                  className="absolute inset-0 bg-blue-400 origin-left transition-all duration-700 ease-out"
                  style={{ transform: `scaleX(${index < currentStep ? 1 : 0})` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-8 h-[2px] overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-7">
        <div key={currentStepData.id} className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label
              htmlFor={currentStepData.field}
              className="text-base font-semibold tracking-tight text-gray-900"
            >
              {currentStepData.label}
            </Label>
            <span className="text-xs font-medium text-gray-400 tabular-nums">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {currentStepData.field === "date" ? (
            <Input
              id={currentStepData.field}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData[currentStepData.field] || ""}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              autoFocus
              className="h-13 text-base border-gray-200 bg-gray-50 focus-visible:border-blue-400 focus-visible:ring-blue-200/50"
            />
          ) : (
            <Input
              id={currentStepData.field}
              type={currentStepData.field === "email" ? "email"
                  : currentStepData.field === "phone" ? "tel"
                  : "text"}
              placeholder={currentStepData.placeholder}
              value={formData[currentStepData.field] || ""}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData[currentStepData.field]?.trim()) handleNext()
              }}
              autoFocus
              className="h-13 text-base border-gray-200 bg-gray-50 focus-visible:border-blue-400 focus-visible:ring-blue-200/50 transition-all duration-300"
            />
          )}

          {currentStepData.field === "service" && (
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "Split AC Cleaning", value: "split-ac" },
                { label: "Window AC Cleaning", value: "window-ac" },
                { label: "Gas Check", value: "gas-check" },
                { label: "Full Service", value: "full-service" }
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleInputChange("service", s.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                    formData.service === s.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <Button
          onClick={handleNext}
          disabled={!formData[currentStepData.field]?.trim() || loading}
          className="w-full h-12 group bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-40"
        >
          {loading ? (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              {currentStep === steps.length - 1 ? "Verify Email" : "Continue"}
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300"
                strokeWidth={2}
              />
            </span>
          )}
        </Button>

        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-700 transition-colors duration-200"
          >
            ← Go back
          </button>
        )}
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
