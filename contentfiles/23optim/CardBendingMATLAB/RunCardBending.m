clc, clear all, close all

noNodes = 100; %the beam solver discretises card beam into 100 nodes
b = 0.21*ones(1,noNodes); %constant card width across length
%b can be ANY distribution you want
%b MUST have a length of 100

[deltaMax] = beamBending(b); %submit b into beamBending solver
%tip deflection, delta, is returned

%calculate node locations across card sheet
%Length of A4 card sheet is 0.297m
%there is a "no design" space of 0.025m at the root of the card
%split the ramaining design length into 100 points
nodeLocations = linspace(0,0.297 - 0.025,100);

%plot the result
% plot(nodeLocations,delta,'ko-')
xlabel('distance, m')
ylabel('deflection, mm')
hold on
% scatter(0.272,deltaMax,'red','filled')
