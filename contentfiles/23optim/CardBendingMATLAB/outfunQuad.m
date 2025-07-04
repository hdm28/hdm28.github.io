function stop = outfunQuad(x,optimValues,state)
 % optimValues is an object that gives further information on the optimisation 
 % state gives the alorithm state, such as "reflection,expansion" etc.
 
 stop = false; %leave as is, unless you wish to define a custom termination criteria

 %here we will extract the function value and iteration number from
 %optimValues

 fval = optimValues.fval;
 iter = optimValues.iteration; 
 hold on;

 set(0, 'defaulttextinterpreter', 'latex') % Fancy label fonts
 
 %% initial plot
noNodes = 100;
b = ones(1,noNodes); % initialise b

nodeLocations = linspace(0,0.297 - 0.025,100);

for i = 1:length(nodeLocations)
    if nodeLocations(i) < (-calcq(x(1),x(2)) - sqrt( ((calcq(x(1),x(2)))^2) - 4*x(1)*(x(2)-0.1))) /  (2*x(1))
        b(i) = 0.21;
    else
        b(i) = 2.*halfwidthQuad(x(1),x(2),nodeLocations(i)) + 0.01;
    end
end

points = [(nodeLocations+0.025)',(b/2+0.105)',(0.105-b/2)'];

A = plot(points(:,1),points(:,2),'r');
B = plot(points(:,1),points(:,3),'r');

Td = text(0.01, 0.23, sprintf('Tip Deflection: %.8f m', fval), 'FontSize', 24, 'Color', 'k');
axis([0,0.3,0,0.25])

 drawnow
 % gif      % for making animation
 pause(0.21);

  if state == 'done'
     pause(0.3)
     alphaValue = 1; % You can adjust this value as needed
     set(A, 'Color', [1 0 0 alphaValue], 'LineWidth', 5);
     set(B, 'Color', [1 0 0 alphaValue], 'LineWidth', 5);
     % gif; gif; gif; gif %for making animation

 else
     delete(A);
     delete(B);
     delete(Td);
    

  end  

end
