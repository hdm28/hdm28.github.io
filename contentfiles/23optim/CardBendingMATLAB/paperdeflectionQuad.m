clc, clear, close all

paperoutline
% set(0,'DefaultFigureWindowStyle','docked')
% gif('NM.gif','DelayTime',0.4,'resolution',400) % for saving animation -
% % % requires gif toolbox/addon thingy

%% set options for optimiser
options = optimoptions('fmincon','Algorithm','sqp','OutputFcn'...
    ,@outfunQuad,'Display','iter','StepTolerance',1e-8,...
    'FunctionTolerance',1e-8,'MaxFunctionEvaluations',10000);

%% set initial conditions [p r]
X0 = [0.1; 0.105];

Xopt = fmincon(@ObjFunQuad,X0,[],[],[],[],[-0.75 0.1],[3 0.25],[],options);

%% output optimised widths

noNodes = 100;
OptWidths = ones(1,noNodes); % initialise widths

nodeLocations = linspace(0,0.297 - 0.025,100);

for i = 1:length(nodeLocations)
    if nodeLocations(i) < (-calcq(Xopt(1),Xopt(2)) - sqrt( ((calcq(Xopt(1),Xopt(2)))^2) - 4*Xopt(1)*(Xopt(2)-0.1))) /  (2*Xopt(1))
        b(i) = 0.21;
    else
        b(i) = 2.*halfwidthQuad(Xopt(1),Xopt(2),nodeLocations(i)) + 0.01;
    end
end
