function utip = beamBending(b)

if length(b) ~= 100
    disp('length of input vector, b, must be 100')
else
    noElems = 100;

    rho = 400; %g/m^2
    rho = (rho/1000); %kg/m^2;
    t = 0.47e-3; %0.3mm
    L = 0.297 - 0.025;

    I = (b.*t^3)/12;
    x = linspace(0,L,noElems);  %  0-->272 in 100 steps
    p = 9.81*rho.*b;
    E = 4.25e9*ones(1,noElems); 

 

    ii = flip(linspace(1,length(x),noElems));

    for i = ii(1:end-1)
        if i == noElems
            T(i) = 0;   
            M(i) = 0;
        end

            T(i-1) = T(i) + 0.5*(p(i-1) + p(i))*(x(i) - x(i-1));
            M(i-1) = M(i) - T(i)*(x(i) - x(i-1)) + ((1/6)*p(i-1) + (1/3)*p(i))*(x(i) - x(i-1))^2;

    end

    k = M./(E.*I);

    for i = 1:noElems-1

        if i == 1
            theta(i) = 0;    
            u = 0;
        end

            theta(i+1) = theta(i) + 0.5*(k(i+1) + k(i))*(x(i+1) - x(i));
            u(i+1) = u(i) + theta(i)*(x(i+1) - x(i)) + ((1/6)*k(i+1) + (1/3)*k(i))*(x(i+1) - x(i))^2;

    end
end

[utip,~] = max(-u);

end



