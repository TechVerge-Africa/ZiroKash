
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const savingsSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Target amount must be a positive number",
  }),
  initialDeposit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Initial deposit must be a non-negative number",
  }),
});

interface SavingsPlanFormProps {
  onClose: () => void;
}

export function SavingsPlanForm({ onClose }: SavingsPlanFormProps) {
  const form = useForm<z.infer<typeof savingsSchema>>({
    resolver: zodResolver(savingsSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      initialDeposit: "",
    },
  });

  function onSubmit(values: z.infer<typeof savingsSchema>) {
    console.log(values);
    
    toast({
      title: "Savings Plan Created",
      description: `Your ${values.name} savings plan has been created successfully.`,
    });
    
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savings Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="Emergency Fund" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input placeholder="5,000.00" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="initialDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Deposit</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input placeholder="0.00" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Savings Plan
          </Button>
        </div>
      </form>
    </Form>
  );
}
