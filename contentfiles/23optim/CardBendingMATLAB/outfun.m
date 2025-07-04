function stop = outfun(x,optimValues,state)
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
 points = [x(1) + 0.025, 0.21 ; ...
           x(1) + 0.025, 0; ...
           0.297, 0.11 + x(2); ...
           0.297, 0.1 - x(2);];

 dots = scatter(points(:,1),points(:,2));

 top = plot(points([1,3],1),points([1,3],2),'r', 'LineWidth', 3);
 bottom = plot(points([2,4],1),points([2,4],2),'r', 'LineWidth', 3);

 Td = text(0.01, 0.23, sprintf('Tip Deflection: %.8f m', fval), 'FontSize', 24, 'Color', 'k');
 Aval = text(0.18, 0.19, sprintf('a: %.7f m', x(1)), 'FontSize', 20, 'Color', 'k');
 Bval = text(0.17, 0.02, sprintf('b: %.12f m', x(2)), 'FontSize', 20, 'Color', 'k');

 drawnow
 % gif      % for making animation
 pause(0.15);

  if state == 'done'
     pause(0.3)
     alphaValue = 1; % You can adjust this value as needed
     set(top, 'Color', [1 0 0 alphaValue], 'LineWidth', 5);
     set(bottom, 'Color', [1 0 0 alphaValue], 'LineWidth', 5);
     % gif; gif; gif; gif %for making animation

 else
     delete(Td);
     delete(top);
     delete(bottom);
     delete(dots);
     delete(Aval);
     delete(Bval);

  end  

end
