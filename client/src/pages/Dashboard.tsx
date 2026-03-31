import { useState } from 'react';
import { FileText, Package, MessageSquare, GraduationCap, Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TabLayout from '../components/layout/TabLayout';
import PlansList from '../components/dashboard/PlansList';
import ConversationalPlanner from '../components/lesson-plan/ConversationalPlanner';
import MaterialGenerator from '../components/materials/MaterialGenerator';
import ReflectionModule from '../components/reflection/ReflectionModule';
import TrailsList from '../components/trails/TrailsList';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('plans');
  const [creatingPlan, setCreatingPlan] = useState(false);

  const tabs = [
    { id: 'plans', label: 'Meus Planos', icon: <FileText className="w-4 h-4" /> },
    { id: 'materials', label: 'Materiais', icon: <Package className="w-4 h-4" /> },
    { id: 'reflections', label: 'Reflexões', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'trails', label: 'Trilhas', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  const handleNewPlan = () => {
    setCreatingPlan(true);
    setActiveTab('plans');
  };

  const handlePlanSaved = () => {
    setCreatingPlan(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full py-6 px-4">
        {creatingPlan ? (
          <div>
            <button
              onClick={() => setCreatingPlan(false)}
              className="text-sm text-indigo-600 hover:underline mb-4"
            >
              &larr; Voltar ao painel
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Novo Plano de Aula
            </h2>
            <ConversationalPlanner onPlanSaved={handlePlanSaved} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <TabLayout tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === 'plans' && <PlansList onNewPlan={handleNewPlan} />}
              {activeTab === 'materials' && <MaterialGenerator />}
              {activeTab === 'reflections' && <ReflectionModule />}
              {activeTab === 'trails' && <TrailsList />}
            </TabLayout>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
