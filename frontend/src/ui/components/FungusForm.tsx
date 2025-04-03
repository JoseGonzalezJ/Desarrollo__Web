"use client"
import React, { useEffect, useState } from "react";
import { getFungi, createFungus, updateFungus, deleteFungus } from "../../domain/services/FungusService";
import { Fungus } from "../../domain/models/Fungus";
import { Plus, Pencil, Trash2 } from "lucide-react"
import { seaStormColors } from "../../utils/colors"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"


const FungusPage: React.FC = () => {
  const [fungi, setFungi] = useState<Fungus[]>([])
  const [editingFungus, setEditingFungus] = useState<Fungus | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadFungi()
  }, [])

  const loadFungi = async () => {
    try {
      const data = await getFungi()
      setFungi(data)
    } catch (error) {
      console.error("Error loading fungi", error)
    }
  }

  const handleSave = async (fungus: Fungus) => {
    try {
      const fungusToSave = {
        ...fungus,
        nutrients: Number(fungus.nutrients),
        optimalHumidity: Number(fungus.optimalHumidity),
        optimalPH: Number(fungus.optimalPH),
        optimalTemperature: Number(fungus.optimalTemperature),
      }
      if (fungus.id) {
        await updateFungus(fungusToSave)
      } else {
        await createFungus(fungusToSave)
      }
      setEditingFungus(null)
      setIsDialogOpen(false)
      loadFungi()
    } catch (error) {
      console.error("Error saving fungus", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFungus(id)
      loadFungi()
    } catch (error) {
      console.error("Error deleting fungus", error)
    }
  }

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: seaStormColors.background }}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold" style={{ color: seaStormColors.blue.dark }}>
            Catálogo de Hongos
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() =>
                  setEditingFungus({ name: "", optimalHumidity: 0, optimalPH: 0, optimalTemperature: 0, nutrients: 0 })
                }
                style={{
                  backgroundColor: seaStormColors.teal.medium,
                  color: seaStormColors.sand.light,
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Agregar Hongo
              </Button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: seaStormColors.sand.light }}>
              <FungusForm
                fungus={editingFungus!}
                onSave={handleSave}
                onCancel={() => {
                  setEditingFungus(null)
                  setIsDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: seaStormColors.blue.medium }}>Nombre</TableHead>
                <TableHead style={{ color: seaStormColors.blue.medium }}>Humedad</TableHead>
                <TableHead style={{ color: seaStormColors.blue.medium }}>pH</TableHead>
                <TableHead style={{ color: seaStormColors.blue.medium }}>Temperatura</TableHead>
                <TableHead style={{ color: seaStormColors.blue.medium }}>Nutrientes</TableHead>
                <TableHead style={{ color: seaStormColors.blue.medium }}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fungi.map((fungus) => (
                <TableRow key={fungus.id}>
                  <TableCell className="font-medium" style={{ color: seaStormColors.blue.dark }}>
                    {fungus.name}
                  </TableCell>
                  <TableCell>{fungus.optimalHumidity}%</TableCell>
                  <TableCell>{fungus.optimalPH}</TableCell>
                  <TableCell>{fungus.optimalTemperature}°C</TableCell>
                  <TableCell>{fungus.nutrients}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingFungus(fungus)
                        setIsDialogOpen(true)
                      }}
                      style={{ color: seaStormColors.blue.medium }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(fungus.id!)}
                      style={{ color: seaStormColors.sand.darker }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const FungusForm: React.FC<{ fungus: Fungus; onSave: (fungus: Fungus) => void; onCancel: () => void }> = ({
  fungus,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Fungus>({
    ...fungus,
    nutrients: fungus.nutrients || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle style={{ color: seaStormColors.blue.dark }}>
          {formData.id ? "Editar Hongo" : "Agregar Nuevo Hongo"}
        </DialogTitle>
        <DialogDescription style={{ color: seaStormColors.blue.medium }}>
          Complete los detalles del hongo a continuación.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right" style={{ color: seaStormColors.blue.dark }}>
            Nombre
          </Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="optimalHumidity" className="text-right" style={{ color: seaStormColors.blue.dark }}>
            Humedad
          </Label>
          <Input
            id="optimalHumidity"
            name="optimalHumidity"
            type="number"
            value={formData.optimalHumidity || ""}
            onChange={handleChange}
            className="col-span-3"
            required
            placeholder="Ingrese la humedad óptima"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="optimalPH" className="text-right" style={{ color: seaStormColors.blue.dark }}>
            pH
          </Label>
          <Input
            id="optimalPH"
            name="optimalPH"
            type="number"
            value={formData.optimalPH || ""}
            onChange={handleChange}
            className="col-span-3"
            required
            placeholder="Ingrese el pH óptimo"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="optimalTemperature" className="text-right" style={{ color: seaStormColors.blue.dark }}>
            Temperatura
          </Label>
          <Input
            id="optimalTemperature"
            name="optimalTemperature"
            type="number"
            value={formData.optimalTemperature || ""}
            onChange={handleChange}
            className="col-span-3"
            required
            placeholder="Ingrese la temperatura óptima"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nutrients" className="text-right" style={{ color: seaStormColors.blue.dark }}>
            Nutrientes
          </Label>
          <Input
            id="nutrients"
            name="nutrients"
            type="number"
            value={formData.nutrients || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Ingrese el nivel de nutrientes"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel} style={{ color: seaStormColors.blue.medium }}>
          Cancelar
        </Button>
        <Button type="submit" style={{ backgroundColor: seaStormColors.teal.medium, color: seaStormColors.sand.light }}>
          Guardar
        </Button>
      </DialogFooter>
    </form>
  )
}

export default FungusPage