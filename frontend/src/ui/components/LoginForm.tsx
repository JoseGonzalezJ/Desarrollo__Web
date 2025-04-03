import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { seaStormColors } from "../../utils/colors"

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) throw new Error("Usuario o contraseña incorrectos")

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      if (data.role === "admin") {
        navigate("/fungus-form")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el servidor")
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
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center" style={{ color: seaStormColors.blue.medium }}>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: seaStormColors.blue.medium }}>
                Usuario
              </Label>
              <Input
                id="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ borderColor: seaStormColors.sand.medium }}
              />
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
            <Button
              className="w-full"
              type="submit"
              style={{
                backgroundColor: seaStormColors.teal.medium,
                color: seaStormColors.sand.light,
              }}
            >
              Ingresar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm" style={{ color: seaStormColors.blue.medium }}>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" style={{ color: seaStormColors.teal.medium, fontWeight: "bold" }}>
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginForm
 