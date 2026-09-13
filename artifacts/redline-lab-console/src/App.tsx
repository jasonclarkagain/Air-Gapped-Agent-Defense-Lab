import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crosshair,
  FileCheck2,
  Filter,
  LockKeyhole,
  Map,
  Menu,
  Pause,
  Play,
  Plus,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  UserRound,
  Wifi,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type View = 'overview' | 'tasks' | 'fleet' | 'sites' | 'audit';
type SiteKey = 'UTAH' | 'NEVADA';
type AgentStatus = 'active' | 'paused' | 'degraded';
type FeedFilter = 'all' | 'security' | 'dispatch' | 'agent';

type Agent = {
  id: string;
  name: string;
  role: string;
  site: SiteKey;
  status: AgentStatus;
  heartbeat: string;
  task: string;
  version: string;
  lastSeen: string;
};

type Task = {
  id: string;
  title: string;
  site: SiteKey;
  agent: string;
  scope: string;
  status: 'running' | 'queued' | 'complete' | 'blocked';
  created: string;
  priority: 'routine' | 'elevated' | 'review';
};

type Approval = {
  id: string;
  action: string;
  site: SiteKey;
  agent: string;
  requested: string;
  reason: string;
  scope: string;
};

type EventItem = {
  id: string;
  kind: FeedFilter;
  title: string;
  detail: string;
  time: string;
  site?: SiteKey;
  severity: 'normal' | 'attention' | 'safe';
};

const queryClient = new QueryClient();

const initialAgents: Agent[] = [
  { id: 'utah-scout-01', name: 'U-Scout 01', role: 'Evidence collection', site: 'UTAH', status: 'active', heartbeat: '12 sec', task: 'Network baseline / rack 04', version: 'v2.8.4', lastSeen: '09:42:18' },
  { id: 'utah-judge-01', name: 'U-Judge 01', role: 'Policy evaluation', site: 'UTAH', status: 'active', heartbeat: '16 sec', task: 'Waiting for evidence', version: 'v2.8.4', lastSeen: '09:42:14' },
  { id: 'utah-scribe-01', name: 'U-Scribe 01', role: 'Audit & synthesis', site: 'UTAH', status: 'paused', heartbeat: '14 min', task: 'Paused by lead', version: 'v2.8.3', lastSeen: '09:28:01' },
  { id: 'nevada-probe-01', name: 'N-Probe 01', role: 'Controlled probing', site: 'NEVADA', status: 'active', heartbeat: '9 sec', task: 'Model input boundary sweep', version: 'v3.1.0', lastSeen: '09:42:21' },
  { id: 'nevada-gate-01', name: 'N-Gate 01', role: 'Approval broker', site: 'NEVADA', status: 'degraded', heartbeat: '3 min', task: 'Awaiting operator review', version: 'v3.1.0', lastSeen: '09:39:06' },
  { id: 'nevada-scribe-01', name: 'N-Scribe 01', role: 'Audit & synthesis', site: 'NEVADA', status: 'active', heartbeat: '18 sec', task: 'Writing run ledger', version: 'v3.0.9', lastSeen: '09:42:10' },
];

const initialTasks: Task[] = [
  { id: 'RL-2048', title: 'Reconcile model input boundary findings', site: 'NEVADA', agent: 'N-Probe 01', scope: 'model-boundary.read', status: 'running', created: 'Today, 09:18', priority: 'elevated' },
  { id: 'RL-2047', title: 'Capture clean-room network baseline', site: 'UTAH', agent: 'U-Scout 01', scope: 'telemetry.read', status: 'running', created: 'Today, 08:54', priority: 'routine' },
  { id: 'RL-2046', title: 'Review quarantine release evidence', site: 'NEVADA', agent: 'N-Gate 01', scope: 'evidence.review', status: 'blocked', created: 'Today, 08:31', priority: 'review' },
  { id: 'RL-2045', title: 'Index overnight run ledger', site: 'UTAH', agent: 'U-Scribe 01', scope: 'audit.write', status: 'complete', created: 'Yesterday, 22:46', priority: 'routine' },
  { id: 'RL-2044', title: 'Compare policy snapshots, cycle 17', site: 'UTAH', agent: 'U-Judge 01', scope: 'policy.compare', status: 'complete', created: 'Yesterday, 20:12', priority: 'routine' },
];

const initialApprovals: Approval[] = [
  { id: 'APR-091', action: 'Promote evidence bundle to review lane', site: 'NEVADA', agent: 'N-Gate 01', requested: '6 min ago', reason: 'Bundle passed local integrity checks; human sign-off required before review promotion.', scope: 'evidence.promote' },
  { id: 'APR-090', action: 'Extend controlled probe window by 15 min', site: 'NEVADA', agent: 'N-Probe 01', requested: '19 min ago', reason: 'Probe requires one additional bounded sample to resolve a conflicting observation.', scope: 'probe.extend' },
  { id: 'APR-087', action: 'Seal Utah baseline for lead review', site: 'UTAH', agent: 'U-Scout 01', requested: '34 min ago', reason: 'Baseline is complete and ready for a read-only handoff.', scope: 'baseline.seal' },
];

const initialEvents: EventItem[] = [
  { id: 'evt-1', kind: 'security', title: 'Boundary check passed', detail: 'Nevada ingress remained isolated during probe window', time: '09:41:56', site: 'NEVADA', severity: 'safe' },
  { id: 'evt-2', kind: 'dispatch', title: 'Task RL-2048 started', detail: 'Dispatched to N-Probe 01 by A. Mercer', time: '09:18:04', site: 'NEVADA', severity: 'normal' },
  { id: 'evt-3', kind: 'agent', title: 'N-Gate 01 heartbeat delayed', detail: 'Last heartbeat 3 min ago · degraded state', time: '09:39:06', site: 'NEVADA', severity: 'attention' },
  { id: 'evt-4', kind: 'security', title: 'Approval gate opened', detail: 'APR-091 requires lead decision before promotion', time: '09:36:22', site: 'NEVADA', severity: 'attention' },
  { id: 'evt-5', kind: 'agent', title: 'U-Scribe 01 paused', detail: 'Paused by operator A. Mercer', time: '09:28:01', site: 'UTAH', severity: 'normal' },
  { id: 'evt-6', kind: 'dispatch', title: 'Task RL-2047 accepted', detail: 'Scope verified against Utah allowlist', time: '08:54:10', site: 'UTAH', severity: 'safe' },
];

const navItems: { id: View; label: string; icon: typeof Activity; count?: number }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'tasks', label: 'Task queue', icon: ClipboardList, count: 4 },
  { id: 'fleet', label: 'Agent fleet', icon: Bot },
  { id: 'sites', label: 'Lab sites', icon: Map },
  { id: 'audit', label: 'Audit log', icon: FileCheck2 },
];

function AppShell() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [agents, setAgents] = useState(initialAgents);
  const [tasks, setTasks] = useState(initialTasks);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [events, setEvents] = useState(initialEvents);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 520);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredEvents = useMemo(
    () => feedFilter === 'all' ? events : events.filter((event) => event.kind === feedFilter),
    [events, feedFilter],
  );

  const handleNav = (view: View) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const announce = (message: string) => {
    setNotice(message);
  };

  const toggleAgent = (id: string) => {
    setAgents((current) => current.map((agent) => {
      if (agent.id !== id) return agent;
      const nextStatus: AgentStatus = agent.status === 'paused' ? 'active' : 'paused';
      announce(`${agent.name} ${nextStatus === 'paused' ? 'paused' : 'resumed'} by operator`);
      setEvents((feed) => [{
        id: `evt-${Date.now()}`,
        kind: 'agent',
        title: `${agent.name} ${nextStatus === 'paused' ? 'paused' : 'resumed'}`,
        detail: `Operator control applied from the ${agent.site} fleet view`,
        time: 'just now',
        site: agent.site,
        severity: 'normal',
      }, ...feed]);
      return { ...agent, status: nextStatus, heartbeat: nextStatus === 'paused' ? 'just now' : '12 sec', task: nextStatus === 'paused' ? 'Paused by lead' : 'Awaiting assignment' };
    }));
  };

  const decideApproval = (approval: Approval, decision: 'approved' | 'rejected') => {
    setApprovals((current) => current.filter((item) => item.id !== approval.id));
    setEvents((feed) => [{
      id: `evt-${Date.now()}`,
      kind: 'security',
      title: `${approval.id} ${decision}`,
      detail: `${approval.action} · recorded by A. Mercer`,
      time: 'just now',
      site: approval.site,
      severity: decision === 'approved' ? 'safe' : 'attention',
    }, ...feed]);
    announce(`${approval.id} ${decision}. Decision added to audit log.`);
  };

  const addTask = (data: { title: string; site: SiteKey; agent: string; scope: string; priority: Task['priority'] }) => {
    const task: Task = {
      id: `RL-${2050 + tasks.length}`,
      title: data.title,
      site: data.site,
      agent: data.agent,
      scope: data.scope,
      priority: data.priority,
      status: 'queued',
      created: 'Just now',
    };
    setTasks((current) => [task, ...current]);
    setEvents((feed) => [{
      id: `evt-${Date.now()}`,
      kind: 'dispatch',
      title: `Task ${task.id} queued`,
      detail: `Scope verified · assigned to ${task.agent}`,
      time: 'just now',
      site: task.site,
      severity: 'safe',
    }, ...feed]);
    setDispatchOpen(false);
    setActiveView('tasks');
    announce(`${task.id} added to the dispatch queue.`);
  };

  return (
    <div className="console-shell flex min-h-[100dvh]">
      <aside className={`sidebar-sheen fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] transition-transform duration-200 lg:static lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-[hsl(var(--sidebar-border))] px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <Crosshair size={19} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[.15em]">Redline Lab</div>
            <div className="font-mono text-[10px] uppercase tracking-[.19em] text-[hsl(var(--sidebar-foreground)/.55)]">Console / v1.4.0</div>
          </div>
        </div>

        <div className="px-4 pt-6">
          <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.48)]">
            <span>Command surface</span>
            <span className="font-mono">01</span>
          </div>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`button-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`group flex w-full items-center justify-between rounded-[3px] px-3 py-2.5 text-left text-[13px] transition-colors ${selected ? 'bg-[hsl(var(--sidebar-primary)/.14)] text-[hsl(var(--sidebar-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]'}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} strokeWidth={selected ? 2.3 : 1.8} className={selected ? 'text-[hsl(var(--sidebar-primary))]' : ''} />
                    {item.label}
                  </span>
                  {item.count && <span className="font-mono text-[10px] text-[hsl(var(--sidebar-foreground)/.5)]">{item.count}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 rounded-[3px] border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.48)] p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.56)]">
              <LockKeyhole size={13} /> Safety posture
            </div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#77d3b6]" />
              Human gates enforced
            </div>
            <p className="text-[11px] leading-relaxed text-[hsl(var(--sidebar-foreground)/.52)]">No autonomous boundary crossing. All actions stay inside the site allowlist.</p>
          </div>
          <div className="flex items-center gap-2 border-t border-[hsl(var(--sidebar-border))] pt-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--sidebar-accent))] text-[11px] font-semibold">AM</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium">Avery Mercer</div>
              <div className="font-mono text-[10px] text-[hsl(var(--sidebar-foreground)/.48)]">RESEARCH LEAD</div>
            </div>
            <button type="button" data-testid="button-user-settings" onClick={() => announce('Operator settings are local to this console session.')} className="text-[hsl(var(--sidebar-foreground)/.48)] hover:text-[hsl(var(--sidebar-foreground))]" aria-label="Open operator settings"><Settings2 size={15} /></button>
          </div>
        </div>
      </aside>

      {mobileNavOpen && <button type="button" data-testid="button-close-mobile-nav" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.24)] lg:hidden" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[67px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.92)] px-4 backdrop-blur-md sm:px-6 lg:px-9">
          <div className="flex items-center gap-3">
            <button type="button" data-testid="button-open-mobile-nav" onClick={() => setMobileNavOpen(true)} className="rounded-[3px] p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] lg:hidden" aria-label="Open navigation"><Menu size={18} /></button>
            <div className="hidden items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] sm:flex">
              <span className="font-mono uppercase tracking-[.15em]">Redline</span>
              <ChevronRight size={13} />
            </div>
            <h1 className="text-[15px] font-semibold tracking-[-.02em] capitalize">{activeView === 'overview' ? 'Operations overview' : navItems.find((item) => item.id === activeView)?.label}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] md:flex">
              <Wifi size={14} className="text-[hsl(var(--secondary))]" />
              <span>Local session</span>
              <span className="font-mono text-[10px]">09:42 UTC</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-[hsl(var(--secondary))]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--secondary))]" /> All systems nominal
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="fade-up">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-[hsl(var(--secondary))]">
                <span className="h-px w-5 bg-[hsl(var(--secondary))]" /> Defensive research control
              </div>
              <h2 className="text-[27px] font-semibold tracking-[-.045em] text-[hsl(var(--foreground))] sm:text-[31px]">{activeView === 'overview' ? 'Good morning, Avery.' : navItems.find((item) => item.id === activeView)?.label}</h2>
              <p className="mt-1 max-w-2xl text-[13px] text-[hsl(var(--muted-foreground))]">{activeView === 'overview' ? 'Two isolated labs. One clear operating picture.' : 'Review scoped activity and make deliberate changes from one place.'}</p>
            </div>
            <button type="button" data-testid="button-open-dispatch" onClick={() => setDispatchOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-[3px] bg-[hsl(var(--primary))] px-4 text-[12px] font-semibold text-[hsl(var(--primary-foreground))] shadow-sm transition-transform hover:-translate-y-px active:translate-y-0">
              <Plus size={16} /> Dispatch task
            </button>
          </div>

          {activeView === 'overview' && <OverviewView agents={agents} tasks={tasks} approvals={approvals} events={filteredEvents} feedFilter={feedFilter} setFeedFilter={setFeedFilter} onApproval={decideApproval} onNav={handleNav} onDispatch={() => setDispatchOpen(true)} isLoading={isLoading} />}
          {activeView === 'tasks' && <TasksView tasks={tasks} onDispatch={() => setDispatchOpen(true)} />}
          {activeView === 'fleet' && <FleetView agents={agents} onToggle={toggleAgent} isLoading={isLoading} />}
          {activeView === 'sites' && <SitesView agents={agents} tasks={tasks} />}
          {activeView === 'audit' && <AuditView events={filteredEvents} feedFilter={feedFilter} setFeedFilter={setFeedFilter} />}
        </div>
      </main>

      {notice && <div role="status" data-testid="status-toast" className="fixed bottom-5 right-5 z-50 flex max-w-[340px] items-start gap-3 rounded-[4px] border border-[hsl(var(--secondary)/.28)] bg-[hsl(var(--card))] px-4 py-3 text-[12px] shadow-[0_14px_32px_rgba(21,47,55,.14)]"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[hsl(var(--secondary))]" /><span>{notice}</span><button type="button" data-testid="button-dismiss-toast" onClick={() => setNotice(null)} className="ml-auto text-[hsl(var(--muted-foreground))]" aria-label="Dismiss notification"><X size={14} /></button></div>}
      {dispatchOpen && <DispatchModal agents={agents} onClose={() => setDispatchOpen(false)} onSubmit={addTask} />}
    </div>
  );
}

function SectionLabel({ children, action }: { children: string; action?: string }) {
  return <div className="mb-3 flex items-center justify-between"><h3 className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">{children}</h3>{action && <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/.72)]">{action}</span>}</div>;
}

function SiteBadge({ site, compact = false }: { site: SiteKey; compact?: boolean }) {
  const isUtah = site === 'UTAH';
  return <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[.08em] ${compact ? '' : 'rounded-[2px] border px-2 py-1'} ${isUtah ? 'border-[#d9b74d]/40 text-[#95751a]' : 'border-[hsl(var(--secondary)/.3)] text-[hsl(var(--secondary))]'}`}><span className={`h-1.5 w-1.5 rounded-full ${isUtah ? 'bg-[#d9b74d]' : 'bg-[hsl(var(--secondary))]'}`} />{site}</span>;
}

function OverviewView({ agents, tasks, approvals, events, feedFilter, setFeedFilter, onApproval, onNav, onDispatch, isLoading }: { agents: Agent[]; tasks: Task[]; approvals: Approval[]; events: EventItem[]; feedFilter: FeedFilter; setFeedFilter: (filter: FeedFilter) => void; onApproval: (approval: Approval, decision: 'approved' | 'rejected') => void; onNav: (view: View) => void; onDispatch: () => void; isLoading: boolean }) {
  const active = agents.filter((agent) => agent.status === 'active').length;
  const running = tasks.filter((task) => task.status === 'running').length;
  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Agents online" value={`${active}/${agents.length}`} detail="Across both isolated sites" icon={Bot} accent="teal" loading={isLoading} />
      <MetricCard label="Tasks in motion" value={running.toString().padStart(2, '0')} detail="No cross-site assignments" icon={Radio} accent="orange" loading={isLoading} />
      <MetricCard label="Awaiting approval" value={approvals.length.toString().padStart(2, '0')} detail="Human gate required" icon={LockKeyhole} accent="gold" loading={isLoading} />
      <MetricCard label="Boundary posture" value="INTACT" detail="Last check 09:41:56 UTC" icon={ShieldCheck} accent="teal" loading={isLoading} />
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.34fr)_minmax(370px,.86fr)]">
      <div className="fade-up fade-up-delay-1 rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5 sm:px-6">
          <div><SectionLabel action="LIVE">Site operating picture</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Isolation state and workload by lab</p></div>
          <button type="button" data-testid="button-sites-overview" onClick={() => onNav('sites')} className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--secondary))] hover:underline">View sites <ArrowUpRight size={13} /></button>
        </div>
        <div className="grid divide-y divide-[hsl(var(--border))] md:grid-cols-2 md:divide-x md:divide-y-0">
          <SiteOverview site="UTAH" name="Utah dual air gap" description="Primary evidence collection" agents={agents} tasks={tasks} />
          <SiteOverview site="NEVADA" name="Nevada triple air gap" description="Controlled adversarial research" agents={agents} tasks={tasks} />
        </div>
        <div className="scanline flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[hsl(var(--border))] px-5 py-3.5 text-[11px] text-[hsl(var(--muted-foreground))] sm:px-6">
          <span className="flex items-center gap-2"><LockKeyhole size={13} className="text-[hsl(var(--secondary))]" /> No autonomous egress</span>
          <span className="flex items-center gap-2"><FileCheck2 size={13} /> Every action audited</span>
          <span className="flex items-center gap-2"><UserRound size={13} /> Lead approval enforced</span>
        </div>
      </div>

      <div className="fade-up fade-up-delay-2 rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5">
          <div><SectionLabel action={`${approvals.length} OPEN`}>Approval queue</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Actions paused at the human gate</p></div>
          <LockKeyhole size={17} className="text-[hsl(var(--primary))]" />
        </div>
        <div className="divide-y divide-[hsl(var(--border))]">
          {approvals.length === 0 ? <EmptyState icon={CheckCircle2} title="No pending approvals" detail="The queue is clear. New gated actions will appear here." /> : approvals.slice(0, 2).map((approval) => <ApprovalRow key={approval.id} approval={approval} onDecision={onApproval} />)}
        </div>
        {approvals.length > 2 && <button type="button" data-testid="button-view-approvals" onClick={() => onNav('audit')} className="flex w-full items-center justify-center gap-1 border-t border-[hsl(var(--border))] py-3 text-[11px] font-semibold text-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted)/.45)]">View all approvals <ChevronRight size={13} /></button>}
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(350px,.94fr)]">
      <div className="fade-up fade-up-delay-2 rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[hsl(var(--border))] px-5 py-5 sm:px-6">
          <div><SectionLabel action="LAST 24 HOURS">Activity feed</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Auditable changes across the command surface</p></div>
          <div className="flex items-center gap-1 rounded-[3px] border border-[hsl(var(--border))] p-0.5"><Filter size={12} className="ml-2 text-[hsl(var(--muted-foreground))]" />{(['all', 'security', 'dispatch', 'agent'] as FeedFilter[]).map((filter) => <button type="button" key={filter} data-testid={`button-filter-${filter}`} onClick={() => setFeedFilter(filter)} className={`rounded-[2px] px-2 py-1 text-[10px] font-medium capitalize transition-colors ${feedFilter === filter ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{filter}</button>)}</div>
        </div>
        <EventList events={events.slice(0, 5)} />
        <button type="button" data-testid="button-open-audit" onClick={() => onNav('audit')} className="flex w-full items-center justify-center gap-1 border-t border-[hsl(var(--border))] py-3 text-[11px] font-semibold text-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted)/.45)]">Open audit log <ArrowUpRight size={13} /></button>
      </div>

      <div className="fade-up fade-up-delay-3 rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5 sm:px-6">
          <div><SectionLabel action={`${tasks.filter((task) => task.status === 'queued').length} QUEUED`}>Dispatch queue</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Scoped work waiting for an available agent</p></div>
          <button type="button" data-testid="button-quick-dispatch" onClick={onDispatch} className="rounded-[3px] border border-[hsl(var(--primary)/.38)] p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.08)]" aria-label="Dispatch a new task"><Plus size={15} /></button>
        </div>
        <div className="divide-y divide-[hsl(var(--border))]">
          {tasks.filter((task) => task.status === 'queued' || task.status === 'blocked').slice(0, 3).map((task) => <TaskRow key={task.id} task={task} />)}
          {tasks.filter((task) => task.status === 'queued' || task.status === 'blocked').length === 0 && <EmptyState icon={ClipboardList} title="Queue is clear" detail="Dispatch a scoped task when a lab is ready." actionLabel="Dispatch task" onAction={onDispatch} />}
        </div>
      </div>
    </div>
  </div>;
}

function MetricCard({ label, value, detail, icon: Icon, accent, loading }: { label: string; value: string; detail: string; icon: typeof Activity; accent: 'teal' | 'orange' | 'gold'; loading: boolean }) {
  const accentClass = accent === 'orange' ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)]' : accent === 'gold' ? 'text-[#a27e16] bg-[#d9b74d]/[.13]' : 'text-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/.1)]';
  return <div data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`} className="fade-up rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-4 shadow-[var(--shadow-card)] sm:p-5"><div className="mb-5 flex items-start justify-between"><span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{label}</span><span className={`rounded-[3px] p-2 ${accentClass}`}><Icon size={16} /></span></div>{loading ? <div className="skeleton h-8 w-20 rounded-[2px]" /> : <div className="font-mono text-[26px] font-semibold tracking-[-.06em]">{value}</div>}<div className="mt-2 text-[11px] text-[hsl(var(--muted-foreground))]">{detail}</div></div>;
}

function SiteOverview({ site, name, description, agents, tasks }: { site: SiteKey; name: string; description: string; agents: Agent[]; tasks: Task[] }) {
  const siteAgents = agents.filter((agent) => agent.site === site);
  const siteTasks = tasks.filter((task) => task.site === site);
  const active = siteAgents.filter((agent) => agent.status === 'active').length;
  return <div className="p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><SiteBadge site={site} /><h4 className="mt-3 text-[15px] font-semibold">{name}</h4><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{description}</p></div><div className="text-right"><div className="font-mono text-[20px] font-semibold">{active}<span className="text-[12px] font-normal text-[hsl(var(--muted-foreground))]">/{siteAgents.length}</span></div><div className="text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">online</div></div></div><div className="grid grid-cols-2 gap-2 border-t border-[hsl(var(--border))] pt-4"><div><div className="font-mono text-[17px] font-medium">{siteTasks.filter((task) => task.status === 'running').length}</div><div className="text-[10px] text-[hsl(var(--muted-foreground))]">in motion</div></div><div><div className="font-mono text-[17px] font-medium text-[#a27e16]">{siteAgents.filter((agent) => agent.status === 'degraded').length || '—'}</div><div className="text-[10px] text-[hsl(var(--muted-foreground))]">needs attention</div></div></div></div>;
}

function ApprovalRow({ approval, onDecision }: { approval: Approval; onDecision: (approval: Approval, decision: 'approved' | 'rejected') => void }) {
  return <div className="p-4"><div className="mb-2 flex items-start justify-between gap-2"><span className="font-mono text-[10px] text-[hsl(var(--primary))]">{approval.id}</span><SiteBadge site={approval.site} compact /></div><div className="text-[12px] font-semibold leading-snug">{approval.action}</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{approval.agent} · {approval.requested}</div><div className="mt-3 flex gap-2"><button type="button" data-testid={`button-approve-${approval.id}`} onClick={() => onDecision(approval, 'approved')} className="flex h-7 flex-1 items-center justify-center gap-1 rounded-[2px] bg-[hsl(var(--secondary))] px-2 text-[10px] font-semibold text-[hsl(var(--secondary-foreground))]"><Check size={13} /> Approve</button><button type="button" data-testid={`button-reject-${approval.id}`} onClick={() => onDecision(approval, 'rejected')} className="flex h-7 items-center justify-center gap-1 rounded-[2px] border border-[hsl(var(--border))] px-3 text-[10px] font-semibold text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--destructive)/.45)] hover:text-[hsl(var(--destructive))]"><Ban size={13} /> Reject</button></div></div>;
}

function EventList({ events }: { events: EventItem[] }) {
  if (events.length === 0) return <EmptyState icon={Activity} title="No events match this filter" detail="Try another activity category." />;
  return <div className="divide-y divide-[hsl(var(--border))]">{events.map((event) => <div key={event.id} data-testid={`event-${event.id}`} className="flex gap-3 px-5 py-3.5 sm:px-6"><div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${event.severity === 'attention' ? 'bg-[hsl(var(--primary))]' : event.severity === 'safe' ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--muted-foreground)/.5)]'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><span className="text-[12px] font-medium">{event.title}</span><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{event.time}</span></div><div className="mt-0.5 truncate text-[11px] text-[hsl(var(--muted-foreground))]">{event.detail}</div></div>{event.site && <SiteBadge site={event.site} compact />}</div>)}</div>;
}

function TaskRow({ task }: { task: Task }) {
  const statusClass = task.status === 'blocked' ? 'text-[#a27e16] bg-[#d9b74d]/[.11]' : task.status === 'queued' ? 'text-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/.1)]' : 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]';
  return <div data-testid={`row-task-${task.id}`} className="flex items-start gap-3 px-5 py-4 sm:px-6"><div className="mt-1 rounded-[2px] border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted-foreground))]"><ClipboardList size={14} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{task.id}</span><SiteBadge site={task.site} compact /></div><div className="mt-1 truncate text-[12px] font-semibold">{task.title}</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{task.agent} · {task.scope}</div></div><span className={`shrink-0 rounded-[2px] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.08em] ${statusClass}`}>{task.status}</span></div>;
}

function TasksView({ tasks, onDispatch }: { tasks: Task[]; onDispatch: () => void }) {
  const [filter, setFilter] = useState<'all' | Task['status']>('all');
  const visible = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
  return <div className="fade-up rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]"><div className="flex flex-col justify-between gap-4 border-b border-[hsl(var(--border))] px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div><SectionLabel action={`${tasks.length} TOTAL`}>Scoped task queue</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Every task is bound to one site and one allowlisted scope.</p></div><div className="flex items-center gap-2"><div className="flex items-center gap-1 rounded-[3px] border border-[hsl(var(--border))] p-1"><SlidersHorizontal size={13} className="ml-1.5 text-[hsl(var(--muted-foreground))]" />{(['all', 'running', 'queued', 'blocked', 'complete'] as const).map((item) => <button type="button" key={item} data-testid={`button-task-filter-${item}`} onClick={() => setFilter(item)} className={`rounded-[2px] px-2 py-1.5 text-[10px] capitalize ${filter === item ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{item}</button>)}</div><button type="button" data-testid="button-tasks-dispatch" onClick={onDispatch} className="inline-flex h-9 items-center gap-1.5 rounded-[3px] bg-[hsl(var(--primary))] px-3 text-[11px] font-semibold text-[hsl(var(--primary-foreground))]"><Plus size={14} /> New task</button></div></div><div className="hidden grid-cols-[.7fr_2.3fr_1fr_1fr_.8fr] gap-4 border-b border-[hsl(var(--border))] px-6 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))] md:grid"><span>Ref</span><span>Task</span><span>Assignment</span><span>Scope</span><span>Status</span></div><div className="divide-y divide-[hsl(var(--border))]">{visible.length ? visible.map((task) => <div key={task.id} data-testid={`table-row-task-${task.id}`} className="grid gap-2 px-5 py-4 md:grid-cols-[.7fr_2.3fr_1fr_1fr_.8fr] md:items-center md:gap-4 md:px-6"><div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{task.id}<div className="mt-1"><SiteBadge site={task.site} compact /></div></div><div><div className="text-[12px] font-semibold">{task.title}</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{task.created} · {task.priority} priority</div></div><div className="text-[11px]">{task.agent}</div><div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{task.scope}</div><div><span className={`inline-flex rounded-[2px] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.08em] ${task.status === 'blocked' ? 'bg-[#d9b74d]/[.11] text-[#a27e16]' : task.status === 'running' ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : task.status === 'queued' ? 'bg-[hsl(var(--secondary)/.1)] text-[hsl(var(--secondary))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}>{task.status}</span></div></div>) : <EmptyState icon={ClipboardList} title="No tasks in this view" detail="The selected status filter has no matching work." />}</div></div>;
}

function FleetView({ agents, onToggle, isLoading }: { agents: Agent[]; onToggle: (id: string) => void; isLoading: boolean }) {
  const [search, setSearch] = useState('');
  const visible = agents.filter((agent) => `${agent.name} ${agent.role} ${agent.site}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="fade-up space-y-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><SectionLabel action={`${agents.length} REGISTERED`}>Agent fleet</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Health, assignment, and operator controls for each isolated runtime.</p></div><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-agent-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search fleet" className="h-9 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--card))] pl-9 pr-3 text-[11px] outline-none focus:border-[hsl(var(--secondary))] sm:w-56" /></div></div>{isLoading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="skeleton h-48 rounded-[4px]" />)}</div> : visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((agent) => <AgentCard key={agent.id} agent={agent} onToggle={onToggle} />)}</div> : <div className="rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))]"><EmptyState icon={Bot} title="No agents found" detail="Try a site, role, or agent name." /></div>}</div>;
}

function AgentCard({ agent, onToggle }: { agent: Agent; onToggle: (id: string) => void }) {
  const statusColor = agent.status === 'active' ? 'text-[hsl(var(--secondary))]' : agent.status === 'degraded' ? 'text-[#a27e16]' : 'text-[hsl(var(--muted-foreground))]';
  return <div data-testid={`card-agent-${agent.id}`} className="rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-px"><div className="mb-5 flex items-start justify-between"><div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-[3px] bg-[hsl(var(--muted))] ${statusColor}`}><Bot size={18} /></div><div><div className="text-[13px] font-semibold">{agent.name}</div><div className="mt-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">{agent.role}</div></div></div><div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.08em] ${statusColor}`}><span className={`h-1.5 w-1.5 rounded-full ${agent.status === 'active' ? 'bg-[hsl(var(--secondary))] pulse-dot' : agent.status === 'degraded' ? 'bg-[#d9b74d]' : 'bg-[hsl(var(--muted-foreground))]'}`} />{agent.status}</div></div><div className="mb-4 rounded-[3px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-3"><div className="mb-1 font-mono text-[9px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Current assignment</div><div className="truncate text-[11px]">{agent.task}</div></div><div className="mb-4 grid grid-cols-3 gap-2 text-[10px]"><div><div className="mb-1 text-[hsl(var(--muted-foreground))]">Site</div><SiteBadge site={agent.site} compact /></div><div><div className="mb-1 text-[hsl(var(--muted-foreground))]">Heartbeat</div><div className="font-mono">{agent.heartbeat}</div></div><div><div className="mb-1 text-[hsl(var(--muted-foreground))]">Build</div><div className="font-mono">{agent.version}</div></div></div><div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-3"><span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))]">SEEN {agent.lastSeen} UTC</span><button type="button" data-testid={`button-toggle-agent-${agent.id}`} onClick={() => onToggle(agent.id)} className={`flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1.5 text-[10px] font-semibold ${agent.status === 'paused' ? 'border-[hsl(var(--secondary)/.35)] text-[hsl(var(--secondary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.45)] hover:text-[hsl(var(--primary))]'}`}>{agent.status === 'paused' ? <><Play size={12} /> Resume</> : <><Pause size={12} /> Pause</>}</button></div></div>;
}

function SitesView({ agents, tasks }: { agents: Agent[]; tasks: Task[] }) {
  return <div className="fade-up grid gap-5 xl:grid-cols-2"><SiteDetail site="UTAH" title="Utah dual air gap" subtitle="Evidence collection and policy evaluation" level="DUAL AIR GAP" agents={agents} tasks={tasks} scopes={['telemetry.read', 'policy.compare', 'audit.write']} /><SiteDetail site="NEVADA" title="Nevada triple air gap" subtitle="Controlled adversarial research with review broker" level="TRIPLE AIR GAP" agents={agents} tasks={tasks} scopes={['model-boundary.read', 'evidence.review', 'probe.extend']} /></div>;
}

function SiteDetail({ site, title, subtitle, level, agents, tasks, scopes }: { site: SiteKey; title: string; subtitle: string; level: string; agents: Agent[]; tasks: Task[]; scopes: string[] }) {
  const siteAgents = agents.filter((agent) => agent.site === site);
  const siteTasks = tasks.filter((task) => task.site === site);
  return <div className="rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]"><div className="border-b border-[hsl(var(--border))] p-6"><div className="mb-4 flex items-start justify-between"><div><SiteBadge site={site} /><h3 className="mt-3 text-[21px] font-semibold tracking-[-.04em]">{title}</h3><p className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{subtitle}</p></div><div className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--secondary)/.3)] px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[.1em] text-[hsl(var(--secondary))]"><ShieldCheck size={12} /> {level}</div></div><div className="grid grid-cols-3 gap-3"><div className="rounded-[3px] bg-[hsl(var(--muted)/.6)] p-3"><div className="font-mono text-[18px]">{siteAgents.filter((agent) => agent.status === 'active').length}/{siteAgents.length}</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">agents online</div></div><div className="rounded-[3px] bg-[hsl(var(--muted)/.6)] p-3"><div className="font-mono text-[18px]">{siteTasks.filter((task) => task.status === 'running').length}</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">active tasks</div></div><div className="rounded-[3px] bg-[hsl(var(--muted)/.6)] p-3"><div className="font-mono text-[18px] text-[hsl(var(--secondary))]">OK</div><div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">boundary check</div></div></div></div><div className="p-6"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] font-semibold uppercase tracking-[.17em] text-[hsl(var(--muted-foreground))]">Allowlisted scopes</span><LockKeyhole size={14} className="text-[hsl(var(--secondary))]" /></div><div className="flex flex-wrap gap-2">{scopes.map((scope) => <span key={scope} className="rounded-[2px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] px-2.5 py-1.5 font-mono text-[10px] text-[hsl(var(--foreground)/.78)]">{scope}</span>)}</div><div className="mt-6 flex items-start gap-2 border-t border-[hsl(var(--border))] pt-4 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#a27e16]" /> Agents can only request work within these scopes. Requests outside the site boundary are rejected and logged.</div></div></div>;
}

function AuditView({ events, feedFilter, setFeedFilter }: { events: EventItem[]; feedFilter: FeedFilter; setFeedFilter: (filter: FeedFilter) => void }) {
  return <div className="fade-up rounded-[4px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-card)]"><div className="flex flex-col justify-between gap-4 border-b border-[hsl(var(--border))] px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div><SectionLabel action="LOCAL SESSION">Immutable activity record</SectionLabel><p className="text-[13px] text-[hsl(var(--muted-foreground))]">Operator decisions, boundary checks, and task transitions.</p></div><div className="flex items-center gap-1 rounded-[3px] border border-[hsl(var(--border))] p-1"><Filter size={13} className="ml-1.5 text-[hsl(var(--muted-foreground))]" />{(['all', 'security', 'dispatch', 'agent'] as FeedFilter[]).map((filter) => <button type="button" key={filter} data-testid={`button-audit-filter-${filter}`} onClick={() => setFeedFilter(filter)} className={`rounded-[2px] px-2 py-1.5 text-[10px] capitalize ${feedFilter === filter ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{filter}</button>)}</div></div><div className="hidden grid-cols-[130px_1.25fr_1.5fr_100px] gap-5 border-b border-[hsl(var(--border))] px-6 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))] md:grid"><span>Time</span><span>Event</span><span>Detail</span><span>Site</span></div>{events.length ? <div className="divide-y divide-[hsl(var(--border))]">{events.map((event) => <div key={event.id} data-testid={`audit-row-${event.id}`} className="grid gap-2 px-5 py-4 md:grid-cols-[130px_1.25fr_1.5fr_100px] md:items-center md:gap-5 md:px-6"><div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{event.time}<div className="mt-1 uppercase tracking-[.1em] text-[9px]">{event.kind}</div></div><div className="flex items-center gap-2 text-[12px] font-medium"><span className={`h-1.5 w-1.5 rounded-full ${event.severity === 'attention' ? 'bg-[hsl(var(--primary))]' : event.severity === 'safe' ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--muted-foreground)/.5)]'}`} />{event.title}</div><div className="text-[11px] text-[hsl(var(--muted-foreground))]">{event.detail}</div><div>{event.site ? <SiteBadge site={event.site} compact /> : <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">SYSTEM</span>}</div></div>)}</div> : <EmptyState icon={FileCheck2} title="No audit entries match" detail="Try switching the activity filter." />}</div>;
}

function EmptyState({ icon: Icon, title, detail, actionLabel, onAction }: { icon: typeof Activity; title: string; detail: string; actionLabel?: string; onAction?: () => void }) {
  return <div className="flex flex-col items-center justify-center px-6 py-12 text-center"><div className="mb-3 rounded-full bg-[hsl(var(--muted))] p-3 text-[hsl(var(--muted-foreground))]"><Icon size={19} /></div><div className="text-[13px] font-semibold">{title}</div><div className="mt-1 max-w-[260px] text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{detail}</div>{actionLabel && onAction && <button type="button" data-testid="button-empty-state-action" onClick={onAction} className="mt-4 inline-flex items-center gap-1.5 rounded-[3px] border border-[hsl(var(--primary)/.4)] px-3 py-2 text-[10px] font-semibold text-[hsl(var(--primary))]"><Plus size={13} /> {actionLabel}</button>}</div>;
}

function DispatchModal({ agents, onClose, onSubmit }: { agents: Agent[]; onClose: () => void; onSubmit: (data: { title: string; site: SiteKey; agent: string; scope: string; priority: Task['priority'] }) => void }) {
  const [title, setTitle] = useState('');
  const [site, setSite] = useState<SiteKey>('UTAH');
  const [agent, setAgent] = useState('U-Scout 01');
  const [scope, setScope] = useState('telemetry.read');
  const [priority, setPriority] = useState<Task['priority']>('routine');
  const siteAgents = agents.filter((item) => item.site === site);
  const scopes = site === 'UTAH' ? ['telemetry.read', 'policy.compare', 'audit.write'] : ['model-boundary.read', 'evidence.review', 'probe.extend'];
  useEffect(() => {
    setAgent(siteAgents[0]?.name || '');
    setScope(scopes[0]);
  }, [site]);
  const submit = () => {
    if (title.trim() && agent) onSubmit({ title: title.trim(), site, agent, scope, priority });
  };
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground)/.34)] p-0 backdrop-blur-[2px] sm:items-center sm:p-5"><div role="dialog" aria-modal="true" aria-labelledby="dispatch-title" className="w-full max-w-[560px] rounded-t-[6px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[0_22px_70px_rgba(21,47,55,.26)] sm:rounded-[5px]"><div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5 sm:px-6"><div><div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[.17em] text-[hsl(var(--primary))]"><Terminal size={13} /> Controlled dispatch</div><h2 id="dispatch-title" className="text-[20px] font-semibold tracking-[-.04em]">Add task to queue</h2><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">A human remains responsible for every dispatch.</p></div><button type="button" data-testid="button-close-dispatch" onClick={onClose} className="rounded-[3px] p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label="Close dispatch dialog"><X size={17} /></button></div><div className="space-y-4 px-5 py-5 sm:px-6"><div><label htmlFor="dispatch-title-input" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Task objective</label><input id="dispatch-title-input" data-testid="input-dispatch-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Describe one bounded research objective" className="h-10 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-[12px] outline-none focus:border-[hsl(var(--secondary))]" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="dispatch-site" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Isolated site</label><select id="dispatch-site" data-testid="select-dispatch-site" value={site} onChange={(event) => setSite(event.target.value as SiteKey)} className="h-10 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-[12px] outline-none focus:border-[hsl(var(--secondary))]"><option value="UTAH">UTAH · dual air gap</option><option value="NEVADA">NEVADA · triple air gap</option></select></div><div><label htmlFor="dispatch-agent" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Assigned agent</label><select id="dispatch-agent" data-testid="select-dispatch-agent" value={agent} onChange={(event) => setAgent(event.target.value)} className="h-10 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-[12px] outline-none focus:border-[hsl(var(--secondary))]">{siteAgents.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></div></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="dispatch-scope" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Allowlisted scope</label><select id="dispatch-scope" data-testid="select-dispatch-scope" value={scope} onChange={(event) => setScope(event.target.value)} className="h-10 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 font-mono text-[11px] outline-none focus:border-[hsl(var(--secondary))]">{scopes.map((item) => <option key={item} value={item}>{item}</option>)}</select></div><div><label htmlFor="dispatch-priority" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Priority</label><select id="dispatch-priority" data-testid="select-dispatch-priority" value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])} className="h-10 w-full rounded-[3px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-[12px] outline-none focus:border-[hsl(var(--secondary))]"><option value="routine">Routine</option><option value="elevated">Elevated</option><option value="review">Review required</option></select></div></div><div className="flex items-start gap-2 rounded-[3px] border border-[#d9b74d]/35 bg-[#d9b74d]/[.08] px-3 py-2.5 text-[10px] leading-relaxed text-[#806518]"><AlertTriangle size={14} className="mt-0.5 shrink-0" /> Dispatch is rejected if the scope does not match the selected lab allowlist. Agents cannot cross site boundaries.</div></div><div className="flex justify-end gap-2 border-t border-[hsl(var(--border))] px-5 py-4 sm:px-6"><button type="button" data-testid="button-cancel-dispatch" onClick={onClose} className="h-9 rounded-[3px] border border-[hsl(var(--border))] px-4 text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Cancel</button><button type="button" data-testid="button-submit-dispatch" onClick={submit} disabled={!title.trim()} className="h-9 rounded-[3px] bg-[hsl(var(--primary))] px-4 text-[11px] font-semibold text-[hsl(var(--primary-foreground))] disabled:cursor-not-allowed disabled:opacity-45">Queue task <ChevronRight className="ml-1 inline-block" size={14} /></button></div></div></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={AppShell} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}