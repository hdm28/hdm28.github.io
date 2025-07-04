clc, clear, close all

paperoutline
% set(0,'DefaultFigureWindowStyle','docked')
% gif('NM.gif','DelayTime',0.4,'resolution',400) % for saving animation -
% % % requires gif toolbox/addon thingy

%% set options for optimiser
options = optimoptions('fmincon','Algorithm','sqp','OutputFcn'...
    ,@outfun,'Display','iter','StepTolerance',1e-12,...
    'FunctionTolerance',1e-12,'MaxFunctionEvaluations',10000);

%% set initial conditions
X0 = [0.1; 0.05];

Xopt = fmincon(@ObjFun,X0,[],[],[],[],[0 0],[0.272 0.1],[],options);

%% output optimised widths
noNodes = 100;
OptWidths = ones(1,noNodes); % initialise b

nodeLocations = linspace(0,0.297 - 0.025,100);

for i = 1:length(nodeLocations)

    if nodeLocations(i) < Xopt(1)
        OptWidths(i) = 0.21;
    else
        OptWidths(i) = 2.*halfwidth(Xopt(1),Xopt(2),nodeLocations(i)) + 0.01;
    end
end
