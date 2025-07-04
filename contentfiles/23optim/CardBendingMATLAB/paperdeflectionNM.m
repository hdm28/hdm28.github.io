clc, clear, close all

paperoutline
% gif('NM.gif','DelayTime',0.4,'resolution',400) % for saving animation -
% % % requires gif toolbox/addon thingy

%set initial conditions
X0 = [0.1; 0.05];
 
%% set options for optimiser

options = optimset('OutputFcn',@outfun,'Display','iter',...
    'MaxIter',100,'TolX',0.0005);
 
% - Run optimisation from X0 with the options and output optimum variables, x,
% and associated objective function value, fval
% - @ObjFunc tells the optimiser to use our ObjFunc file

[x,fval] = fminsearch(@ObjFun,X0,options);