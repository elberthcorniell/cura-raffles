"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, CreditCard, Minus, Plus, Building2, Loader2, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface BankAccount {
  id: number;
  name: string;
  bank: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  holderName?: string;
  cedula?: string;
}

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raffleId: number;
  ticketPrice: number;
  availableTickets: number;
}

const purchaseFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  whatsappNumber: z.string().min(10, "Número de WhatsApp inválido").regex(/^[\d\s\-\+\(\)]+$/, "Formato de número inválido"),
  ticketQuantity: z.number().min(1, "Debes seleccionar al menos 1 boleto"),
  accountId: z.number({ required_error: "Selecciona una cuenta bancaria" }).positive("Selecciona una cuenta bancaria"),
  voucher: z.instanceof(File, { message: "Sube el comprobante de transferencia" })
    .refine(file => file.size <= 5 * 1024 * 1024, "El archivo no debe exceder 5MB")
    .refine(
      file => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
      "Formato inválido. Solo JPG, PNG o PDF"
    ),
});

type PurchaseFormData = z.infer<typeof purchaseFormSchema>;

export default function PurchaseDialog({
  open,
  onOpenChange,
  raffleId,
  ticketPrice,
  availableTickets,
}: PurchaseDialogProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const copyToClipboard = async (text: string, fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsappNumber: "",
      ticketQuantity: 1,
      accountId: undefined,
      voucher: undefined,
    },
  });

  const { watch, setValue, reset } = form;
  const ticketQuantity = watch("ticketQuantity");
  const selectedAccountId = watch("accountId");
  const voucherFile = watch("voucher");
  const totalPrice = ticketQuantity * ticketPrice;

  // Fetch bank accounts when dialog opens
  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const response = await fetch('/api/accounts');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setAccounts(result.data);
        setValue("accountId", result.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuentas bancarias",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = ticketQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableTickets) {
      setValue("ticketQuantity", newQuantity);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("voucher", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      const formData = new FormData();
      formData.append('voucher', data.voucher);
      formData.append('raffleId', raffleId.toString());
      formData.append('ticketQuantity', data.ticketQuantity.toString());
      formData.append('totalAmount', totalPrice.toString());
      formData.append('name', data.name.trim());
      formData.append('whatsappNumber', data.whatsappNumber.trim());
      formData.append('accountId', data.accountId.toString());
      if (data.email?.trim()) {
        formData.append('email', data.email.trim());
      }

      const response = await fetch('/api/purchases/voucher', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const whatsapp = data.whatsappNumber.trim();
        toast({
          title: "¡Comprobante enviado!",
          description: "Tu comprobante ha sido recibido. Te notificaremos cuando sea verificado.",
        });
        reset();
        onOpenChange(false);
        router.push(`/verify-tickets?phone=${encodeURIComponent(whatsapp)}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al enviar el comprobante",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar el comprobante. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Comprar Boletos
          </DialogTitle>
          <DialogDescription>
            Selecciona la cantidad de boletos y el método de pago
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Ticket Quantity Selector */}
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <Label className="text-base font-medium">Cantidad de boletos</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={ticketQuantity <= 1}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold min-w-[3rem] text-center">
                    {ticketQuantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={ticketQuantity >= availableTickets}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-2 p-4 bg-gradient-card border border-card-border rounded-lg">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{ticketQuantity} boletos × RD${ticketPrice.toLocaleString()}</span>
                  <span>RD${(ticketQuantity * ticketPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-card-border">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-white">
                    RD${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 py-4 border-t border-card-border">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ej: juan@ejemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Te enviaremos confirmación cuando tu pago sea verificado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de WhatsApp *</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="do"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="809 123 4567"
                      />
                    </FormControl>
                    <FormDescription>
                      El código de país se selecciona automáticamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Tabs */}
            <Tabs defaultValue="voucher" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voucher" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Transferencia Bancaria
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2" disabled>
                  <CreditCard className="w-4 h-4" />
                  Tarjeta de Crédito
                </TabsTrigger>
              </TabsList>

              {/* Bank Voucher Tab */}
              <TabsContent value="voucher" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="voucher"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subir comprobante de transferencia *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="flex-1"
                          />
                          {voucherFile && (
                            <span className="text-sm text-muted-foreground">
                              {voucherFile.name}
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Selecciona la cuenta para transferir *</FormLabel>
                      <FormControl>
                        <div>
                          {isLoadingAccounts ? (
                            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">Cargando cuentas...</span>
                            </div>
                          ) : accounts.length > 0 ? (
                            <div className="grid gap-2 space-y-2">
                              {accounts.map((account) => {
                                const isSelected = selectedAccountId === account.id;
                                return (
                                  <button
                                    key={account.id}
                                    type="button"
                                    onClick={() => setValue("accountId", account.id, { shouldValidate: true })}
                                    className={`relative flex items-start text-left p-4 rounded-lg border-2 transition-all ${
                                      isSelected
                                        ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/20'
                                        : 'border-muted-foreground/20 bg-muted hover:border-muted-foreground/40 hover:bg-muted/80'
                                    }`}
                                  >
                                    {/* Selection indicator */}
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'border-secondary bg-secondary'
                                        : 'border-muted-foreground/40 bg-transparent'
                                    }`}>
                                      {isSelected && <Check className="h-3 w-3 text-secondary-foreground" />}
                                    </div>
                                    
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Building2 className={`h-4 w-4 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} />
                                        <span className={`font-semibold ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                          {account.bank || account.name}
                                        </span>
                                      </div>
                                      {account.accountNumber && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
                                          <span>{account.accountType}:</span>
                                          <span className="font-mono">{account.accountNumber}</span>
                                          <button
                                            type="button"
                                            onClick={(e) => copyToClipboard(account.accountNumber, `account-${account.id}`, e)}
                                            className="inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 transition-colors ml-1"
                                            title="Copiar número de cuenta"
                                          >
                                            {copiedField === `account-${account.id}` ? (
                                              <Check className="h-3 w-3" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </button>
                                        </p>
                                      )}
                                      {account.holderName && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
                                          <span>A nombre de: {account.holderName}</span>
                                          {/* {account.cedula && (
                                            <>
                                              <span>— Cédula: {account.cedula}</span>
                                              <button
                                                type="button"
                                                onClick={(e) => copyToClipboard(account.cedula!, `cedula-${account.id}`, e)}
                                                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 transition-colors ml-1"
                                                title="Copiar cédula"
                                              >
                                                {copiedField === `cedula-${account.id}` ? (
                                                  <Check className="h-3 w-3" />
                                                ) : (
                                                  <Copy className="h-3 w-3" />
                                                )}
                                              </button>
                                            </>
                                          )} */}
                                        </p>
                                      )}
                                    </div>

                                    {/* Selected badge */}
                                    {isSelected && (
                                      <span className="absolute top-2 right-2 text-xs font-medium text-secondary bg-secondary/20 px-2 py-0.5 rounded-full">
                                        Seleccionada
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
                              <p>No hay cuentas bancarias disponibles</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedAccountId && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="font-medium text-foreground">
                      Monto a transferir: RD${totalPrice.toLocaleString()}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold py-6"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Enviar Comprobante
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Credit Card Tab */}
              <TabsContent value="card" className="space-y-4 mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Próximamente</p>
                  <p className="text-sm">El pago con tarjeta de crédito estará disponible pronto.</p>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
