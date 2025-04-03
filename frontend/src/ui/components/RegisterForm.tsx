// src/components/RegisterForm.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

"use client"


import { Card, CardContent, CardHeader, CardTitle } from "../../ui/components/ui/Card"
import { Input } from "../../ui/components/ui/input"
import { Button } from "../../ui/components/ui/button"
import { Label } from "../../ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../ui/components/ui/alert"
import { seaStormColors } from "../../utils/colors"

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess(data.message)
      } else {
        setError(data.message || "Error en el registro, intenta nuevamente.")
      }
    } catch (error) {
      setError("Error en el registro, intenta nuevamente.")
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: seaStormColors.background }}
    >
      <Card className="w-[400px]" style={{ backgroundColor: seaStormColors.cardBg }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center" style={{ color: seaStormColors.blue.dark }}>
            Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: seaStormColors.blue.medium }}>
                Usuario
              </Label>
              <Input
                id="username"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ borderColor: seaStormColors.sand.medium }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: seaStormColors.blue.medium }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderColor: seaStormColors.sand.medium }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" style={{ color: seaStormColors.blue.medium }}>
                Rol
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger style={{ borderColor: seaStormColors.sand.medium }}>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <Alert
                variant="destructive"
                style={{ backgroundColor: `${seaStormColors.sand.darker}30`, borderColor: seaStormColors.sand.darker }}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert
                style={{ backgroundColor: `${seaStormColors.teal.light}30`, borderColor: seaStormColors.teal.light }}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: seaStormColors.teal.medium,
                color: seaStormColors.sand.light,
              }}
            >
              Registrarse
            </Button>
          </form>
          <p className="mt-4 text-center" style={{ color: seaStormColors.blue.medium }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: seaStormColors.teal.medium }}>
              Inicia sesión aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm

