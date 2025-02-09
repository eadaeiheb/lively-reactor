
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCredentials = (email: string) => {
    const blockedTerms = ['shit', 'fuck', 'admin'];
    const lowerEmail = email.toLowerCase();
    
    for (const term of blockedTerms) {
      if (lowerEmail.includes(term)) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage("Format d'email invalide. Veuillez entrer une adresse email valide.");
      setIsLoading(false);
      return;
    }

    if (!validateCredentials(email)) {
      setErrorMessage("Cet email n'est pas autorisé.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('https://plateform.draminesaid.com/app/login.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success && data.user) {
        if (!data.user.id_client || !data.user.email_client) {
          throw new Error('Structure de données utilisateur invalide');
        }

        if (data.user.user_type !== 'admin') {
          setErrorMessage("Cette interface est réservée aux administrateurs.");
          setIsLoading(false);
          return;
        }

        const safeUserData = {
          id: data.user.id_client,
          email: data.user.email_client,
          nom: data.user.nom_client,
          prenom: data.user.prenom_client,
          telephone: data.user.telephone_client,
          createdAt: data.user.createdat_client,
          userKey: data.user.user_key,
          userType: data.user.user_type,
          status: 1
        };
        
        localStorage.setItem('user', JSON.stringify(safeUserData));
        toast.success('Connexion réussie!');
        
        // Small delay to ensure localStorage is set before navigation
        setTimeout(() => {
          navigate('/app');
        }, 100);
      } else {
        if (data.message === 'Compte pas encore actif, merci pour votre patience.') {
          navigate('/not-active');
        } else {
          setErrorMessage(data.message || "Identifiants invalides.");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Le serveur est temporairement indisponible. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4e54c8] to-[#699ed0]">
      <div className="bg-white rounded-2xl shadow-xl max-w-[450px] w-full p-10 transform transition-transform duration-300 hover:-translate-y-1">
        <h3 className="text-[#699ed0] font-bold text-2xl mb-3 text-center">
          Bienvenue à nouveau!
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#699ed0] focus:border-transparent"
              placeholder="Entrez votre adresse e-mail"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#699ed0] focus:border-transparent"
              placeholder="Entrez votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#699ed0] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:bg-[#5a8dbd] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion en cours...' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
