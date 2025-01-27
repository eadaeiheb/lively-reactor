import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addSeason } from '@/api/seasons';
import { Plus } from 'lucide-react';

export const AddSeasonForm = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('placeholder.jpg'); // Default photo value
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir le nom de la saison"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting season:', { name, photo });
      const response = await addSeason(name, photo);
      console.log('Server response:', response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Saison ajoutée avec succès"
        });
        setName('');
        queryClient.invalidateQueries({ queryKey: ['seasons'] });
      } else {
        throw new Error(response.message || 'Erreur lors de l\'ajout de la saison');
      }
    } catch (error: any) {
      console.error('Error adding season:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom de la saison</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez le nom de la saison"
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {isLoading ? 'Ajout en cours...' : 'Ajouter la saison'}
      </Button>
    </form>
  );
};